//! StoreKit on iOS: `SKPaymentQueue`, its transaction observer and
//! `SKProductsRequest`, messaged dynamically (StoreKit is loaded, not
//! linked, as Native Shell does with optional frameworks). StoreKit talks
//! on the main thread; the module's calls come from the engine's, so each
//! goes to the main thread and awaits its answer there.
//!
//! The purchase's `applicationUsername`, a UUID, is what the App Store
//! Server API reports as the transaction's `appAccountToken`: the server
//! finds the payer by it.

use std::{cell::RefCell, collections::HashMap, ffi::CStr, sync::OnceLock};

use dispatch2::DispatchQueue;
use objc2::{
    MainThreadMarker, MainThreadOnly, define_class, msg_send,
    rc::{Allocated, Retained},
    runtime::{AnyClass, AnyObject, NSObject, NSObjectProtocol},
};
use objc2_foundation::NSString;
use tokio::sync::oneshot;

use crate::{StoreProduct, StorePurchase, StoreTransaction};

/// `SKPaymentTransactionState`s.
const PURCHASED: isize = 1;
const FAILED: isize = 2;
const RESTORED: isize = 3;
const DEFERRED: isize = 4;
/// `SKErrorPaymentCancelled`: the person closed the sheet.
const CANCELLED: isize = 2;
/// `NSNumberFormatterCurrencyStyle`.
const CURRENCY: usize = 2;

type Answer<T> = oneshot::Sender<Result<T, String>>;

/// What the app is waiting for from StoreKit, on the main thread.
#[derive(Default)]
struct State {
    observer: Option<Retained<Observer>>,
    /// Products loaded, by id, for purchases.
    products: HashMap<String, Retained<AnyObject>>,
    /// Product requests running, by the request's address, kept alive.
    loading: HashMap<usize, (Retained<AnyObject>, Answer<Vec<StoreProduct>>)>,
    /// Purchases waiting for the store's answer, by product id.
    buying: HashMap<String, Vec<Answer<StorePurchase>>>,
    /// Paid transactions not finished yet, by transaction id.
    paid: HashMap<String, (Retained<AnyObject>, StoreTransaction)>,
    /// A restore running, and the transactions it brought so far.
    restoring: Option<(Answer<Vec<StoreTransaction>>, Vec<StoreTransaction>)>,
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

define_class!(
    /// The payment queue's transaction observer and the product requests'
    /// delegate.
    #[unsafe(super(NSObject))]
    #[thread_kind = MainThreadOnly]
    #[name = "GAStoreObserver"]
    struct Observer;

    unsafe impl NSObjectProtocol for Observer {}

    impl Observer {
        #[unsafe(method(paymentQueue:updatedTransactions:))]
        fn updated_transactions(&self, _queue: &AnyObject, transactions: &AnyObject) {
            updated(transactions);
        }

        #[unsafe(method(paymentQueueRestoreCompletedTransactionsFinished:))]
        fn restore_finished(&self, _queue: &AnyObject) {
            if let Some((answer, mut list)) = STATE.with_borrow_mut(|s| s.restoring.take()) {
                list.dedup_by(|a, b| a.confirm_id == b.confirm_id);
                let _ = answer.send(Ok(list));
            }
        }

        #[unsafe(method(paymentQueue:restoreCompletedTransactionsFailedWithError:))]
        fn restore_failed(&self, _queue: &AnyObject, error: &AnyObject) {
            if let Some((answer, _)) = STATE.with_borrow_mut(|s| s.restoring.take()) {
                let _ = answer.send(Err(message(error)));
            }
        }

        #[unsafe(method(productsRequest:didReceiveResponse:))]
        fn received(&self, request: &AnyObject, response: &AnyObject) {
            let Some((_, answer)) = STATE.with_borrow_mut(|s| s.loading.remove(&address(request))) else {
                return;
            };
            let _ = answer.send(Ok(products_of(response)));
        }

        #[unsafe(method(request:didFailWithError:))]
        fn request_failed(&self, request: &AnyObject, error: &AnyObject) {
            if let Some((_, answer)) = STATE.with_borrow_mut(|s| s.loading.remove(&address(request))) {
                let _ = answer.send(Err(message(error)));
            }
        }
    }
);

/// Whether StoreKit is here and this device may buy.
pub fn available() -> bool {
    // SAFETY: a class method StoreKit documents as callable from any thread.
    store_kit() && class(c"SKPaymentQueue").is_some_and(|c| unsafe { msg_send![c, canMakePayments] })
}

/// The products of `ids` the store sells.
pub async fn products(ids: Vec<String>) -> Result<Vec<StoreProduct>, String> {
    on_main(move |mtm, answer| {
        observer(mtm);
        let (Some(set_class), Some(request_class)) = (class(c"NSMutableSet"), class(c"SKProductsRequest")) else {
            let _ = answer.send(Err(unavailable()));
            return;
        };
        // SAFETY: StoreKit's and Foundation's documented messages, on the main thread.
        unsafe {
            let set: Retained<AnyObject> = msg_send![set_class, set];
            for id in &ids {
                let _: () = msg_send![&*set, addObject: &*NSString::from_str(id)];
            }
            let request: Allocated<AnyObject> = msg_send![request_class, alloc];
            let request: Retained<AnyObject> = msg_send![request, initWithProductIdentifiers: &*set];
            let delegate = observer(mtm);
            let _: () = msg_send![&*request, setDelegate: &*delegate];
            STATE.with_borrow_mut(|s| s.loading.insert(address(&request), (request.clone(), answer)));
            let _: () = msg_send![&*request, start];
        }
    })
    .await
}

/// Buys the product `id` for the account token `token`.
pub async fn purchase(id: String, token: String) -> Result<StorePurchase, String> {
    on_main(move |mtm, answer| {
        observer(mtm);
        let product = STATE.with_borrow(|s| s.products.get(&id).cloned());
        let (Some(product), Some(payment_class)) = (product, class(c"SKMutablePayment")) else {
            let _ = answer.send(Err(format!("{id} is not loaded")));
            return;
        };
        // SAFETY: StoreKit's documented messages, on the main thread.
        unsafe {
            let payment: Retained<AnyObject> = msg_send![payment_class, paymentWithProduct: &*product];
            let _: () = msg_send![&*payment, setApplicationUsername: &*NSString::from_str(&token)];
            STATE.with_borrow_mut(|s| s.buying.entry(id).or_default().push(answer));
            let _: () = msg_send![&*queue(), addPayment: &*payment];
        }
    })
    .await
}

/// The paid transactions not finished yet.
pub async fn unfinished() -> Vec<StoreTransaction> {
    on_main(|mtm, answer| {
        observer(mtm);
        // The queue's own list holds what arrived before the observer did.
        // SAFETY: StoreKit's documented messages, on the main thread.
        let transactions: Retained<AnyObject> = unsafe { msg_send![&*queue(), transactions] };
        for t in each(&transactions) {
            paid(&t);
        }
        let _ = answer.send(Ok(STATE.with_borrow(|s| s.paid.values().map(|(_, t)| t.clone()).collect())));
    })
    .await
    .unwrap_or_default()
}

/// Restores this Apple account's purchases.
pub async fn restore() -> Result<Vec<StoreTransaction>, String> {
    on_main(|mtm, answer| {
        observer(mtm);
        if STATE.with_borrow(|s| s.restoring.is_some()) {
            let _ = answer.send(Err("a restore is running".into()));
            return;
        }
        STATE.with_borrow_mut(|s| s.restoring = Some((answer, Vec::new())));
        // SAFETY: StoreKit's documented message, on the main thread.
        let _: () = unsafe { msg_send![&*queue(), restoreCompletedTransactions] };
    })
    .await
}

/// Finishes the transaction `id`.
pub async fn finish(id: String) {
    let _ = on_main(move |mtm, answer: Answer<()>| {
        observer(mtm);
        if let Some((t, _)) = STATE.with_borrow_mut(|s| s.paid.remove(&id)) {
            // SAFETY: StoreKit's documented message, on the main thread.
            let _: () = unsafe { msg_send![&*queue(), finishTransaction: &*t] };
        }
        let _ = answer.send(Ok(()));
    })
    .await;
}

/// Runs `f` on the main thread and awaits the answer it sends.
async fn on_main<T: Send + 'static>(
    f: impl FnOnce(MainThreadMarker, Answer<T>) + Send + 'static,
) -> Result<T, String> {
    if !store_kit() {
        return Err(unavailable());
    }
    let (answer, answered) = oneshot::channel();
    DispatchQueue::main().exec_async(move || {
        let mtm = MainThreadMarker::new().expect("the main queue runs on the main thread");
        f(mtm, answer);
    });
    answered.await.unwrap_or_else(|_| Err("the App Store did not answer".into()))
}

/// The transaction observer, added to the payment queue once.
fn observer(mtm: MainThreadMarker) -> Retained<Observer> {
    if let Some(o) = STATE.with_borrow(|s| s.observer.clone()) {
        return o;
    }
    // SAFETY: NSObject's init; adding the observer is StoreKit's documented message.
    let o: Retained<Observer> = unsafe { msg_send![Observer::alloc(mtm), init] };
    STATE.with_borrow_mut(|s| s.observer = Some(o.clone()));
    let _: () = unsafe { msg_send![&*queue(), addTransactionObserver: &*o] };
    o
}

/// What the queue reports about `transactions`.
fn updated(transactions: &AnyObject) {
    for t in each(transactions) {
        // SAFETY: SKPaymentTransaction's and NSError's documented properties.
        let (state, product) = unsafe {
            let state: isize = msg_send![&*t, transactionState];
            let payment: Retained<AnyObject> = msg_send![&*t, payment];
            let product: Option<Retained<NSString>> = msg_send![&*payment, productIdentifier];
            (state, product.map(|p| p.to_string()).unwrap_or_default())
        };
        let outcome = match state {
            PURCHASED | RESTORED => {
                let Some(record) = paid(&t) else { continue };
                if state == RESTORED {
                    STATE.with_borrow_mut(|s| {
                        if let Some((_, list)) = &mut s.restoring {
                            list.push(record);
                        }
                    });
                    continue;
                }
                StorePurchase { state: "purchased".into(), transaction: Some(record), message: None }
            }
            FAILED => {
                // SAFETY: as above; a failed transaction is finished at once.
                let (code, text) = unsafe {
                    let error: Option<Retained<AnyObject>> = msg_send![&*t, error];
                    let _: () = msg_send![&*queue(), finishTransaction: &*t];
                    match error {
                        Some(e) => (msg_send![&*e, code], Some(message(&e))),
                        None => (0, None),
                    }
                };
                let state = if code == CANCELLED { "cancelled" } else { "failed" };
                StorePurchase { state: state.into(), transaction: None, message: text }
            }
            DEFERRED => StorePurchase { state: "pending".into(), transaction: None, message: None },
            _ => continue,
        };
        for answer in STATE.with_borrow_mut(|s| s.buying.remove(&product)).unwrap_or_default() {
            let _ = answer.send(Ok(outcome.clone()));
        }
    }
}

/// Keeps the paid or restored transaction `t` until it is finished.
fn paid(t: &Retained<AnyObject>) -> Option<StoreTransaction> {
    // SAFETY: SKPaymentTransaction's documented properties.
    let (state, id, original) = unsafe {
        let state: isize = msg_send![&**t, transactionState];
        let id: Option<Retained<NSString>> = msg_send![&**t, transactionIdentifier];
        let original: Option<Retained<AnyObject>> = msg_send![&**t, originalTransaction];
        let original: Option<Retained<NSString>> = match original {
            Some(o) => msg_send![&*o, transactionIdentifier],
            None => None,
        };
        (state, id?.to_string(), original.map(|o| o.to_string()))
    };
    if state != PURCHASED && state != RESTORED {
        return None;
    }
    let confirm_id = if state == RESTORED { original.unwrap_or_else(|| id.clone()) } else { id.clone() };
    let record = StoreTransaction { id: id.clone(), confirm_id };
    STATE.with_borrow_mut(|s| s.paid.insert(id, (t.clone(), record.clone())));
    Some(record)
}

/// The products of an `SKProductsResponse`, kept for purchases.
fn products_of(response: &AnyObject) -> Vec<StoreProduct> {
    // SAFETY: SKProductsResponse's, SKProduct's and NSNumberFormatter's documented messages.
    unsafe {
        let products: Retained<AnyObject> = msg_send![response, products];
        let Some(formatter_class) = class(c"NSNumberFormatter") else { return Vec::new() };
        let formatter: Allocated<AnyObject> = msg_send![formatter_class, alloc];
        let formatter: Retained<AnyObject> = msg_send![formatter, init];
        let _: () = msg_send![&*formatter, setNumberStyle: CURRENCY];
        each(&products)
            .into_iter()
            .filter_map(|p| {
                let id: Option<Retained<NSString>> = msg_send![&*p, productIdentifier];
                let id = id?.to_string();
                let locale: Retained<AnyObject> = msg_send![&*p, priceLocale];
                let _: () = msg_send![&*formatter, setLocale: &*locale];
                let price: Retained<AnyObject> = msg_send![&*p, price];
                let price: Option<Retained<NSString>> = msg_send![&*formatter, stringFromNumber: &*price];
                STATE.with_borrow_mut(|s| s.products.insert(id.clone(), p.clone()));
                Some(StoreProduct { id, price: price.map(|p| p.to_string()).unwrap_or_default() })
            })
            .collect()
    }
}

/// The objects of the `NSArray` `array`.
fn each(array: &AnyObject) -> Vec<Retained<AnyObject>> {
    // SAFETY: NSArray's documented messages.
    unsafe {
        let count: usize = msg_send![array, count];
        (0..count).map(|i| msg_send![array, objectAtIndex: i]).collect()
    }
}

/// The default payment queue.
fn queue() -> Retained<AnyObject> {
    let class = class(c"SKPaymentQueue").expect("StoreKit is loaded");
    // SAFETY: SKPaymentQueue's documented class method.
    unsafe { msg_send![class, defaultQueue] }
}

/// An `NSError`'s description.
fn message(error: &AnyObject) -> String {
    // SAFETY: NSError's documented property.
    let text: Option<Retained<NSString>> = unsafe { msg_send![error, localizedDescription] };
    text.map(|t| t.to_string()).unwrap_or_default()
}

fn address(object: &AnyObject) -> usize {
    object as *const AnyObject as usize
}

fn class(name: &CStr) -> Option<&'static AnyClass> {
    AnyClass::get(name)
}

fn unavailable() -> String {
    "the App Store is not available".into()
}

/// Whether StoreKit is loaded (it is not linked).
fn store_kit() -> bool {
    static LOADED: OnceLock<bool> = OnceLock::new();
    *LOADED.get_or_init(|| {
        // SAFETY: loads a system framework; the handle is never closed.
        !unsafe { libc::dlopen(c"/System/Library/Frameworks/StoreKit.framework/StoreKit".as_ptr(), libc::RTLD_LAZY) }
            .is_null()
    })
}
