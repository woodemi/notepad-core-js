[English](./README.md) | 简体中文

# notepad_core
连接并操作智能手写本的Flutter插件

- [36记智能手写本](https://www.36notes.com)
- [磐度智能书写本](http://www.pendo-tech.com/zh-cn/product/a5) TODO
- [和冠智能笔记本](https://www.wacom.com/en-us/products/smartpads) TODO

# 功能
- 扫描设备
- 连接设备
- 接收实时笔迹

## 扫描设备

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

## 连接设备

连接从`notepadConnector.requestDevice()`中获取的`device`

或从`notepadConnector.scanResultStream`中扫描到的`result`

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

## 接收实时笔迹

### NotepadClient#setMode

- NotepadMode.Common

    设备仅保存压力>0的`NotePenPointer`（含时间戳）到**离线字迹**中

- NotepadMode.Sync

    设备发送所有`NotePenPointer`（无时间戳）到连接的**手机/Pad**上

设备默认为`NotepadMode.Common`（连接/未连接），只有连接后`setMode`才会更改

```js
await _notepadClient.setMode(NotepadMode.Sync);
console.log("setMode complete");
```

### NotepadClient#onSyncPointerReceive

当`NotepadMode.Sync`时，接收`NotePenPointer`

```js
let syncPointerReceiver = function (pointers) {
  console.log(`onSyncPointerReceive ${pointers.length}`);
};

_notepadClient.onSyncPointerReceive(syncPointerReceiver);
// ...
_notepadClient.offSyncPointerReceive(syncPointerReceiver);
```
