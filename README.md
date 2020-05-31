English | [简体中文](./README-CN.md)

# notepad_core
Flutter plugin for connect & operate on smart notepad

- [36notes](https://www.36notes.com)
- [Pendo](http://www.pendo-tech.com) TODO
- [Wacom Smartpads](https://www.wacom.com/en-us/products/smartpads) TODO

# Usage
- Scan notepad
- Connect notepad
- Sync notepen pointer

## Scan notepad

### Web

```js
let device = notepadConnector.requestDevice();
console.log(`requestDevice ${device}`);
```

### Mini-program on Wechat

```js
let scanResultReceiver = function (scanResult) {
  console.log(`onScanResult ${scanResult}`);
};
notepadConnector.onScanResult(scanResultReceiver);

notepadConnector.startScan();
// ...
notepadConnector.stopScan();

notepadConnector.offScanResult(scanResultReceiver);
```

## Connect notepad

Connect to `device` requested from `notepadConnector.requestDevice()`

or `scanResult` received from `notepadConnector.onScanResult`

```js
let connectionChangeHandler = function (notepadClient, connectionState) {
  console.log(`onConnectionChange ${notepadClient}, ${connectionState}`);
};
notepadConnector.onConnectionChange(connectionChangeHandler);

notepadConnector.connect(obj); // obj = device/scanResult
// ...
notepadConnector.disconnect();

notepadConnector.offConnectionChange(connectionChangeHandler);
```

## Sync notepen pointer

### NotepadClient#setMode

- NotepadMode.Common

    Notepad saves only `NotePenPointer` with positive pressure & accurate timestamp, into **offline memo** 

- NotepadMode.Sync

    Notepad notify every `NotePenPointer`, positive or not, without timestamp, to connected **mobile device**

Notepad is always `NotepadMode.Common` (connected or disconnected), unless `setMode` after connected

```js
await _notepadClient.setMode(NotepadMode.Sync);
console.log("setMode complete");
```

### NotepadClient#onSyncPointerReceive

Receive `NotePenPointer`s in `NotepadMode.Sync`

```js
let syncPointerReceiver = function (pointers) {
  console.log(`onSyncPointerReceive ${pointers.length}`);
};

_notepadClient.onSyncPointerReceive(syncPointerReceiver);
// ...
_notepadClient.offSyncPointerReceive(syncPointerReceiver);
```
