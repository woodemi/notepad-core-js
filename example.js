import {NotepadConnector} from "./src/index.js";

const notepadConnector = new NotepadConnector();

window.requestDevice = async function () {
    window.notepad = await notepadConnector.requestDevice();
    console.log('requestDevice', window.notepad);
};
