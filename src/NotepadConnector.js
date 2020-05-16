import { notepadCore } from "./platform/interface.js";
import { optionalServiceCollection } from "./Notepad.js";
import NotepadClient from "./NotepadClient.js";

class NotepadConnector {
    constructor() {
        notepadCore.messageHandler = this._handleMessage.bind(this);
    }

    requestDevice() {
        console.info("NotepadConnector requestDevice");
        return notepadCore.requestDevice({
            optionalServices: optionalServiceCollection
        });
    }

    startScan() {
        console.info("NotepadConnector startScan");
        notepadCore.startScan();
    }

    stopScan() {
        console.info("NotepadConnector stopScan");
        notepadCore.stopScan();
    }

    onScanResult() {}

    connect(notepadScanResult, authToken) {}

    disconnect() {}

    claimAuth() {}

    disclaimAuth() {}

    setMode(mode) {}

    onReceiveNotePenPointers() {}

    getMemoSummary() {}

    importMemo() {}

    onImportMemoProgress() {}

    deleteMemo() {}

    getDeviceName() {}

    setDeviceName(name) {}

    getBatteryInfo() {}

    getDeviceDate() {}

    setDeviceDate(timestamp) {}

    getAutoLockTime() {}

    setAutoLockTime(duration) {}

    upgrade(path, version) {}

    onUpgradeProgress() {}

    _handleMessage(message) {
        console.debug("NotepadConnector _handleMessage", message);
        if (message.name === "scanResult") {
            if (NotepadClient.support(message.scanResult) && this.scanResultHandler)
                this.scanResultHandler(message.scanResult);
        }
    }
}

export default NotepadConnector;
