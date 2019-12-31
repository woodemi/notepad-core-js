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

notepadConnector.connectionChangeHandler = function (state) {
    console.log(`handleConnectionChange ${state}`);
    switch (state) {
        case NotepadConnectionState.disconnected:
            console.log(`disconnected`);
            break;
        case NotepadConnectionState.connecting:
            console.log(`connecting`);
            break;
        case NotepadConnectionState.connected:
            console.log(`connected`);
            break;
    }
};
