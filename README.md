English | [简体中文](./README-CN.md)

# notepad_core
Flutter plugin for connect & operate on smart notepad

- [36notes](https://www.36notes.com)
- [Pendo](http://www.pendo-tech.com) TODO
- [Wacom Smartpads](https://www.wacom.com/en-us/products/smartpads) TODO

# Usage
- Scan notepad

## Scan notepad

### Web

```js
let device = notepadConnector.requestDevice();
console.log(`requestDevice ${device}`);
```

### WeChat-mini

TODO

## Connect notepad

Connect to `result`, received from `notepadConnector.scanResultStream`

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

    Notepad saves only `NotePenPointer` with positive pressure & accurate timestamp, into **offline memo** 

- NotepadMode.Sync

    Notepad notify every `NotePenPointer`, positive or not, without timestamp, to connected **mobile device**

Notepad is always `NotepadMode.Common` (connected or disconnected), unless `setMode` after connected

```js
await _notepadClient.setMode(NotepadMode.Sync);
console.log("setMode complete");
```

### NotepadClient#handleSyncPointer

Receive `NotePenPointer`s in `NotepadMode.Sync`

```js
_notepadClient.handleSyncPointer = function (pointers) {
  console.log(`handleSyncPointer ${pointers.length}`);
};
```
