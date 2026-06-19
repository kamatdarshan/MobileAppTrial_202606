# DocManage — Cross-Platform Document Manager

DocManage is a mobile app for **uploading, downloading, and opening documents
and worksheets** (PDF, Word, Excel/CSV, images, code, and more). It is built
once as a React web app and packaged into native **Android** and **iOS** apps
using [Capacitor](https://capacitorjs.com), so a single codebase runs
everywhere.

## Features

- **Upload** any document or worksheet from the device using the native file
  picker. Files are stored locally and persist between launches.
- **Download** a stored file to the device's `Documents` folder (native) or via
  a browser download (web).
- **Open** a file in the device's default viewer (native) or a new browser tab
  (web).
- **Replace** the contents of an existing file, **delete** files, plus search
  and sort by name, date, or size.
- Works fully offline — all content is kept in on-device storage (IndexedDB in
  the WebView).

## How it works

| Concern        | Web                                   | Android / iOS                                            |
| -------------- | ------------------------------------- | -------------------------------------------------------- |
| Pick a file    | `<input type=file>` via FilePicker    | Native document picker (`@capawesome/capacitor-file-picker`) |
| Store content  | IndexedDB                             | IndexedDB inside the WebView                             |
| Download       | Browser download                      | `Filesystem.writeFile` → `Documents/` (`@capacitor/filesystem`) |
| Open           | New browser tab                       | Default app via `@capacitor-community/file-opener`       |

The platform-aware logic lives in `src/services/fileService.ts`; persistence is
in `src/services/storage.ts`. Seeded sample documents are metadata-only and are
labelled "Sample · re-upload to enable" until you upload real content.

## Prerequisites

- **Node.js 20+** and npm
- **Android**: [Android Studio](https://developer.android.com/studio) + an
  Android SDK / emulator or device
- **iOS**: macOS with [Xcode](https://developer.apple.com/xcode/) (Capacitor 8
  uses Swift Package Manager — no CocoaPods required)

## Run as a web app

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build & run on mobile

The native projects (`android/` and `ios/`) are committed. After any change to
the web code, rebuild and sync the assets into them:

```bash
npm run sync           # vite build + cap sync (both platforms)
```

### Android

```bash
npm run android        # builds web, syncs, opens Android Studio
# then Run ▶ from Android Studio, or:
npm run run:android    # build + deploy to a connected device/emulator
```

### iOS (macOS only)

```bash
npm run ios            # builds web, syncs, opens Xcode
# then Run ▶ from Xcode, or:
npm run run:ios        # build + deploy to a simulator/device
```

## Project scripts

| Script                | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Vite dev server (web)                              |
| `npm run build`       | Production web build into `dist/`                  |
| `npm run lint`        | TypeScript type-check (`tsc --noEmit`)             |
| `npm run sync`        | Build web + copy assets into native projects       |
| `npm run android`     | Build, sync, open Android Studio                   |
| `npm run ios`         | Build, sync, open Xcode                            |
| `npm run run:android` | Build + run on Android device/emulator             |
| `npm run run:ios`     | Build + run on iOS simulator/device                |

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · Motion · Capacitor 8
(`@capacitor/filesystem`, `@capawesome/capacitor-file-picker`,
`@capacitor-community/file-opener`).
