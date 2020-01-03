[English](./README.md) | 简体中文

# notepad_core
连接并操作智能手写本的Flutter插件

- [36记智能手写本](https://www.36notes.com)
- [磐度智能书写本](http://www.pendo-tech.com/zh-cn/product/a5) TODO
- [和冠智能笔记本](https://www.wacom.com/en-us/products/smartpads) TODO

# 功能
- 扫描设备
- 接收实时笔迹

## 扫描设备

### Web

```js
let device = notepadConnector.requestDevice();
console.log(`requestDevice ${device}`);
```

### WeChat-mini

TODO

## Connect notepad

连接从`notepadConnector.scanResultStream`中扫描到的`result` 

```js
notepadConnector.connectionChangeHandler = function (client, state) {
  console.log(`handleConnectionChange ${client} ${state}`);
};

notepadConnector.connect(result);
// ...
notepadConnector.disconnect();
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

### NotepadClient#handleSyncPointer

当`NotepadMode.Sync`时，接收`NotePenPointer`

```js
_notepadClient.handleSyncPointer = function (pointers) {
  console.log(`handleSyncPointer ${pointers.length}`);
};
```
