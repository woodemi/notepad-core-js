import {NotepadConnectionState, NotepadConnector} from "./src/index.js";
import {NotepadMode} from "./src/models.js";

const notepadConnector = new NotepadConnector();

window.requestDevice = async function () {
    window.notepad = await notepadConnector.requestDevice();
    console.log("requestDevice", window.notepad);
};

window.connect = function (device) {
    notepadConnector.connect(device);
};

window.disconnect = function () {
    notepadConnector.disconnect();
};

notepadConnector.connectionChangeHandler = function (client, state) {
    console.log(`handleConnectionChange ${client}, ${state}`);
    switch (state) {
        case NotepadConnectionState.disconnected:
            if (window.notepadClient) window.notepadClient.syncPointerHandler = null;
            window.notepadClient = null;
            break;
        case NotepadConnectionState.connected:
            window.notepadClient = client;
            window.notepadClient.syncPointerHandler = window.handleSyncPointer;
            break;
    }
};

window.setMode = function () {
    window.notepadClient.setMode(NotepadMode.Sync);
};

window.handleSyncPointer = function (pointers) {
    console.log(`handleSyncPointer ${pointers.length}`);
};
