import {NotepadConnector} from "./src/index.js";

const notepadConnector = new NotepadConnector();

window.requestDevice = async function () {
    window.notepad = await notepadConnector.requestDevice();
    console.log('requestDevice', window.notepad);
};

window.connect = function (device) {
    notepadConnector.connect(device);
};

window.disconnect = function () {
    console.log('notepadConnector.connectGatt', notepadConnector.connectGatt);
    notepadConnector.disconnect();
};
