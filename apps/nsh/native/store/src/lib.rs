//! In-app purchases for the Great Academy app (`ga/store`): the App Store's
//! auto-renewing subscriptions on iOS, through StoreKit. The app sells, the
//! server records: each purchase carries the payer's account token, and the
//! app sends its transaction id to `ConfirmApplePurchase`, then finishes it
//! (docs/billing.md §8). Elsewhere the module is there but sells nothing.

#[cfg(target_os = "ios")]
mod ios;

use nsh_core::prelude::*;

/// A subscription the App Store sells, as the store shows it to this person.
#[derive(Debug, Clone, Default, PartialEq, JsObject)]
pub struct StoreProduct {
    /// Its product id, `ga.<scope>.<interval>`.
    pub id: String,
    /// Its price in the person's App Store currency, formatted (`$22.99`).
    pub price: String,
}

/// How a purchase ended.
#[derive(Debug, Clone, Default, PartialEq, JsObject)]
pub struct StorePurchase {
    /// `"purchased"`, `"cancelled"`, `"pending"` (waiting for a parent's
    /// approval or a payment method) or `"failed"`.
    pub state: String,
    /// The purchase's transaction, when it was purchased.
    pub transaction: Option<StoreTransaction>,
    /// The store's reason, when it failed.
    pub message: Option<String>,
}

/// A paid transaction the app has not finished yet.
#[derive(Debug, Clone, Default, PartialEq, JsObject)]
pub struct StoreTransaction {
    /// The transaction to finish once the server has it.
    pub id: String,
    /// The transaction to send to `ConfirmApplePurchase`: the transaction
    /// itself, or for one restored, the purchase it restores.
    pub confirm_id: String,
}

/// The App Store, for subscriptions bought in the app.
#[module]
pub struct AppStore;

#[module]
impl AppStore {
    /// Whether this device can buy here: iOS, with purchases allowed.
    pub fn available() -> bool {
        #[cfg(target_os = "ios")]
        return ios::available();
        #[cfg(not(target_os = "ios"))]
        false
    }

    /// The products of `ids` the store sells, with their prices.
    pub async fn products(ids: Vec<String>) -> Result<Vec<StoreProduct>, JsError> {
        #[cfg(target_os = "ios")]
        return ios::products(ids).await.map_err(JsError::Error);
        #[cfg(not(target_os = "ios"))]
        {
            let _ = ids;
            Err(unavailable())
        }
    }

    /// Buys the product `id` (one of [`products`](Self::products)'), for
    /// the account whose App Store token is `token`; resolves once the store
    /// has an answer.
    pub async fn purchase(id: String, token: String) -> Result<StorePurchase, JsError> {
        #[cfg(target_os = "ios")]
        return ios::purchase(id, token).await.map_err(JsError::Error);
        #[cfg(not(target_os = "ios"))]
        {
            let _ = (id, token);
            Err(unavailable())
        }
    }

    /// The paid transactions not finished yet: renewals, and purchases the
    /// app did not get to confirm.
    pub async fn unfinished() -> Result<Vec<StoreTransaction>, JsError> {
        #[cfg(target_os = "ios")]
        return Ok(ios::unfinished().await);
        #[cfg(not(target_os = "ios"))]
        Ok(Vec::new())
    }

    /// Asks the store for this Apple account's purchases again (Restore
    /// Purchases); resolves with them once it has.
    pub async fn restore() -> Result<Vec<StoreTransaction>, JsError> {
        #[cfg(target_os = "ios")]
        return ios::restore().await.map_err(JsError::Error);
        #[cfg(not(target_os = "ios"))]
        Err(unavailable())
    }

    /// Finishes the transaction `id`, once the server has recorded it.
    pub async fn finish(id: String) {
        #[cfg(target_os = "ios")]
        ios::finish(id).await;
        #[cfg(not(target_os = "ios"))]
        let _ = id;
    }
}

#[cfg(not(target_os = "ios"))]
fn unavailable() -> JsError {
    JsError::Error("the App Store sells only on iOS".into())
}

/// The crate's UI set: what the app imports from `ga/store`.
#[native_module("ga/store")]
fn native(registry: &mut Registry) {
    registry.module::<AppStore>();
}
