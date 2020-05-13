import { notepadCore } from "./platform/interface.js";
import { optionalServiceCollection } from "./Notepad.js";

class NotepadConnector {
    requestDevice() {
        console.info('NotepadConnector requestDevice');
        return notepadCore.requestDevice({
            optionalServices: optionalServiceCollection
        });
    }

    startScan() {
        console.info('NotepadConnector startScan');
        notepadCore.startScan();
    }

    stopScan() {
        console.info('NotepadConnector stopScan');
        notepadCore.stopScan();
    }
}

export default NotepadConnector;
