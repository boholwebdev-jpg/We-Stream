# WE STREAM - Android Native Source Code

This directory contains the full source code for the **WE STREAM** Android application.

## Tech Stack
- **Language:** Kotlin
- **UI:** Jetpack Compose
- **Camera:** CameraX
- **Streaming:** RTMP (using MediaCodec)
- **Backend:** Firebase

## How to Build
1. Open this folder in **Android Studio**.
2. Add your `google-services.json` from the Firebase Console to the `app/` directory.
3. Build and run on a physical device (required for camera/streaming).

## Key Components
- `streaming/`: Handles RTMP encoding and push.
- `ui/`: Modern Jetpack Compose screens.
- `services/`: Background streaming support.
