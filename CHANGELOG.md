## [0.3.0] - 2020-5-31
- Support mini-program on Wechat
- Add `startScan`, `stopScan` & `on/offScanResult` to `NotepadConnector` only for mini-program on Wechat
- [**BREAKING CHANGE**] Refactor `connectionChangeHandler` to `on/offConnectionChange`
- [**BREAKING CHANGE**] Refator `syncPointerHandler` to `on/offScanResult`

## [0.2.0] - 2020-1-3

### NotepadConnector
- Add argument `NotepadClient` to `connectionChangeHandler`

### NotepadClient

#### Sync input
- `setMode`
- `syncPointerHandler`

## [0.1.0] - 2020-1-1

### NotepadConnector

#### Request device
- `requestDevice` for Web

#### Connect/Disconnect device
- `connect`, `disconnect`
