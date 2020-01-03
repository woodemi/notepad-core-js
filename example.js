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

const getCanvas = function () {
    if (!window.canvas) {
        window.canvas = document.getElementById("canvas");
    }
    return window.canvas;
};

const getScaleRatio = function () {
    if (!window.scaleRatio) {
        let rect = getCanvas().getBoundingClientRect();
        window.scaleRatio = Math.min(rect.width / 14800.0, rect.height / 21000.0);
    }
    return window.scaleRatio;
};

window.handleSyncPointer = function (pointers) {
    let context = getCanvas().getContext("2d");
    let scaleRatio = getScaleRatio();
    for (let p of pointers) {
        let pre = window.prePointer ? window.prePointer.p : 0;
        if (pre <= 0 && p.p > 0) {
            context.beginPath();
            context.moveTo(p.x * scaleRatio, p.y * scaleRatio);
        } else if (pre > 0 && p.p > 0) {
            context.lineTo(p.x * scaleRatio, p.y * scaleRatio);
        } else if (pre > 0 && p.p <= 0) {
            context.stroke();
        }
        window.prePointer = p;
    }
};
