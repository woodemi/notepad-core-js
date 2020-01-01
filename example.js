import {NotepadConnectionState, NotepadConnector} from "./src/index.js";

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
            window.notepadClient = null;
            break;
        case NotepadConnectionState.connected:
            window.notepadClient = client;
            break;
    }
};
