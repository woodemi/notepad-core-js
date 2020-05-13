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

    // FIXME Class field not supported in npm package for mini-wechat
    // scanResultHandler;

    _handleMessage(message) {
        console.debug("NotepadConnector _handleMessage", message);
        if (message.name === "scanResult") {
            if (NotepadClient.support(message.scanResult) && this.scanResultHandler)
                this.scanResultHandler(message.scanResult);
        }
    }
}

export default NotepadConnector;
