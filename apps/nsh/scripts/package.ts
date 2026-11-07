import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Packages the app for a server chosen at build time, since Native Shell has no
// build-time values: `pnpm nx run nsh:package -- --target macos [--api-url <url>] [nsh package flags]`.
// `nsh package` takes one icon, so the steps after it add the dark icon that the
// platforms choose by the system's appearance, then sign the app again.

const PRODUCTION = "https://greatacademy.dev";
const DEVELOPMENT = 'export const API_URL = "http://localhost:5173";';
const DESKTOPS = new Set(["macos", "windows", "linux"]);
const APP = fileURLToPath(new URL("..", import.meta.url));
const APPLE_ICON = join(APP, "assets/AppIcon.icon");
const ANDROID_SDK = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? join(homedir(), "Library/Android/sdk");
const ANDROID_TARGET = 35;

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const peek = (...names: string[]): string | undefined => {
  const at = args.findIndex((arg) => names.includes(arg));
  return at < 0 ? undefined : args[at + 1];
};
const take = (name: string): string | undefined => {
  const at = args.indexOf(name);
  return at < 0 ? undefined : args.splice(at, 2)[1];
};
const apiUrl = take("--api-url") ?? PRODUCTION;
const target = peek("--target") ?? "";
if (!target) throw new Error("--target is required");

const config = JSON.parse(readFileSync(join(APP, "nsh.json"), "utf8")) as {
  name: string;
  id: string;
  version: string;
  build: number;
};
const name = peek("--name") ?? config.name;
const out = resolve(APP, peek("-o", "--out") ?? ".nsh/out");

const run = (tool: string, ...toolArgs: string[]): string => execFileSync(tool, toolArgs, { encoding: "utf8" });

/** compileAppleIcon compiles the icon with its dark appearance and returns the folder with `Assets.car`. */
function compileAppleIcon(platform: string, devices: string[], minimum: string): string {
  const work = mkdtempSync(join(tmpdir(), "ga-icon-"));
  const targets = devices.flatMap((device) => ["--target-device", device]);
  run(
    "xcrun",
    "actool",
    APPLE_ICON,
    "--compile",
    work,
    "--platform",
    platform,
    ...targets,
    "--minimum-deployment-target",
    minimum,
    "--app-icon",
    "AppIcon",
    "--output-partial-info-plist",
    join(work, "partial.plist"),
  );
  return work;
}

/** IOS_DESIGN_SDK is the SDK the iOS app reports linking against: UIKit draws Liquid Glass, as the tab bar's, only for apps that report iOS 26 or later. */
const IOS_DESIGN_SDK = "26.0";

/**
 * reportNewSdk makes the app's executable report IOS_DESIGN_SDK when its host was linked against an older SDK, as
 * Native Shell's 0.4.0 release was (iOS 18.5), since UIKit would otherwise keep the bars of iOS 18 on every newer
 * system. A host built here with a current Xcode needs nothing. The app is signed again after this.
 */
function reportNewSdk(app: string): void {
  const executable = join(app, run("plutil", "-extract", "CFBundleExecutable", "raw", join(app, "Info.plist")).trim());
  const sdk = /\bsdk (\d+)/.exec(run("xcrun", "vtool", "-show-build", executable))?.[1];
  console.log(`iOS host linked against SDK ${sdk ?? "unknown"}`);
  if (Number(sdk) >= Number.parseInt(IOS_DESIGN_SDK, 10)) return;
  const minimum = run("plutil", "-extract", "MinimumOSVersion", "raw", join(app, "Info.plist")).trim();
  run("xcrun", "vtool", "-set-build-version", "ios", minimum, IOS_DESIGN_SDK, "-replace", "-output", `${executable}.sdk`, executable);
  renameSync(`${executable}.sdk`, executable);
}

/** finishIos puts the icon into a signed iOS app, has it report the new SDK, signs it again and rebuilds the `.ipa`. */
function finishIos(): void {
  const identity = peek("--sign");
  if (!identity) return;
  const app = join(out, `${name}.app`);
  const icon = compileAppleIcon("iphoneos", ["iphone", "ipad"], "17.0");
  for (const file of ["Assets.car", "AppIcon60x60@2x.png", "AppIcon76x76@2x~ipad.png"]) {
    copyFileSync(join(icon, file), join(app, file));
  }
  reportNewSdk(app);
  const entitlements = readdirSync(out).find((file) => file.endsWith(".entitlements"));
  if (!entitlements) throw new Error("nsh package left no entitlements to sign with");
  run("codesign", "--force", "--sign", identity, "--entitlements", join(out, entitlements), app);
  const payload = mkdtempSync(join(tmpdir(), "ga-ipa-"));
  mkdirSync(join(payload, "Payload"));
  cpSync(app, join(payload, "Payload", `${name}.app`), { recursive: true, verbatimSymlinks: true });
  run("ditto", "-c", "-k", "--sequesterRsrc", join(payload, "Payload"), "--keepParent", join(out, `${name}.ipa`));
  rmSync(payload, { recursive: true });
  rmSync(icon, { recursive: true });
}

/** finishMacos adds the icon's catalog to the app, beside the `.icns` that older systems read, and signs it again. */
function finishMacos(): void {
  const app = join(out, `${name}.app`);
  const icon = compileAppleIcon("macosx", ["mac"], "12.0");
  copyFileSync(join(icon, "Assets.car"), join(app, "Contents/Resources/Assets.car"));
  run("plutil", "-replace", "CFBundleIconName", "-string", "AppIcon", join(app, "Contents/Info.plist"));
  run("codesign", "--force", "--sign", "-", app);
  rmSync(icon, { recursive: true });
}

/** androidManifest is the manifest `nsh package` writes, plus plain HTTP when the server needs it. */
function androidManifest(cleartext: boolean): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="${peek("--id") ?? config.id}">
    <uses-permission android:name="android.permission.INTERNET" />
    <application android:label="${name}" android:icon="@mipmap/ic_launcher"${cleartext ? ' android:usesCleartextTraffic="true"' : ""}
        android:extractNativeLibs="false" android:enableOnBackInvokedCallback="true" android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">
        <activity android:name="com.longbridge.nsh.AppActivity" android:exported="true"
            android:windowSoftInputMode="adjustResize"
            android:configChanges="orientation|screenSize|screenLayout|smallestScreenSize|keyboard|keyboardHidden|navigation|uiMode|density|fontScale|locale|layoutDirection">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;
}

/**
 * finishAndroid links the resources again with an icon for the dark, and allows
 * plain HTTP for a test server, which Native Shell allows only in development
 * builds. It stops if the manifest differs from the one `nsh package` wrote in
 * anything else, which a new Native Shell could cause.
 */
function finishAndroid(): void {
  const versions = readdirSync(join(ANDROID_SDK, "build-tools")).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const tools = join(ANDROID_SDK, "build-tools", versions.at(-1) ?? "");
  const apk = join(out, `${name}.apk`);
  const work = mkdtempSync(join(tmpdir(), "ga-apk-"));
  const cleartext = apiUrl.startsWith("http://");
  const light = join(work, "light");
  run("unzip", "-q", apk, "res/*", "-d", light);
  mkdirSync(join(work, "res/mipmap-xxxhdpi"), { recursive: true });
  mkdirSync(join(work, "res/mipmap-night-xxxhdpi"), { recursive: true });
  copyFileSync(join(light, "res/mipmap-xxxhdpi-v4/ic_launcher.png"), join(work, "res/mipmap-xxxhdpi/ic_launcher.png"));
  run("sips", "-z", "192", "192", join(APP, "assets/icon-dark.png"), "--out", join(work, "res/mipmap-night-xxxhdpi/ic_launcher.png"));
  writeFileSync(join(work, "AndroidManifest.xml"), androidManifest(cleartext));
  run(join(tools, "aapt2"), "compile", "-o", join(work, "res.zip"), "--dir", join(work, "res"));
  run(
    join(tools, "aapt2"),
    "link",
    "-o",
    join(work, "base.apk"),
    "-I",
    join(ANDROID_SDK, `platforms/android-${ANDROID_TARGET}/android.jar`),
    "--manifest",
    join(work, "AndroidManifest.xml"),
    "--min-sdk-version",
    "28",
    "--target-sdk-version",
    String(ANDROID_TARGET),
    "--version-code",
    peek("--build") ?? String(config.build),
    "--version-name",
    peek("--app-version") ?? config.version,
    join(work, "res.zip"),
  );

  const manifest = (file: string): string =>
    run(join(tools, "aapt2"), "dump", "xmltree", file, "--file", "AndroidManifest.xml")
      .split("\n")
      .filter((line) => !line.includes("usesCleartextTraffic"))
      .map((line) => line.replace(/ \(line=\d+\)/, ""))
      .sort()
      .join("\n");
  if (manifest(apk) !== manifest(join(work, "base.apk"))) throw new Error(`the manifest of ${apk} changed: update androidManifest`);

  const linked = join(work, "linked");
  run("unzip", "-q", join(work, "base.apk"), "-d", linked);
  const unsigned = join(work, "unsigned.apk");
  copyFileSync(apk, unsigned);
  run("zip", "-q", "-d", unsigned, "META-INF/*", "res/*", "resources.arsc", "AndroidManifest.xml");
  execFileSync("zip", ["-q", "-X", "-0", "-r", unsigned, "AndroidManifest.xml", "resources.arsc", "res"], { cwd: linked });
  const aligned = join(work, "aligned.apk");
  run(join(tools, "zipalign"), "-f", "-P", "16", "4", unsigned, aligned);

  const keystore = peek("--keystore") ?? join(homedir(), ".android/debug.keystore");
  const password = peek("--keystore-password") ?? process.env.NSH_KEYSTORE_PASSWORD ?? "android";
  const alias = peek("--key-alias") ?? "androiddebugkey";
  execFileSync(
    join(tools, "apksigner"),
    ["sign", "--ks", keystore, "--ks-pass", "env:GA_KEYSTORE_PASSWORD", "--ks-key-alias", alias, "--out", apk, aligned],
    { env: { ...process.env, GA_KEYSTORE_PASSWORD: password } },
  );
  rmSync(work, { recursive: true });
}

// A desktop icon is a rounded tile with a margin; a phone rounds the square itself.
const icon = DESKTOPS.has(target) ? ["--icon", "assets/icon-desktop.png"] : [];

const rpc = join(APP, "lib/rpc.ts");
const source = readFileSync(rpc, "utf8");
if (!source.includes(DEVELOPMENT)) throw new Error("lib/rpc.ts no longer has the line this script replaces");

writeFileSync(rpc, source.replace(DEVELOPMENT, `export const API_URL = ${JSON.stringify(apiUrl)};`));
let status: number | null = 1;
try {
  status = spawnSync("nsh", ["package", ".", ...icon, ...args], { cwd: APP, stdio: "inherit" }).status;
} finally {
  writeFileSync(rpc, source);
}
if (status !== 0) process.exit(status ?? 1);

if (target === "ios") finishIos();
if (target === "macos") finishMacos();
if (target === "android") finishAndroid();
