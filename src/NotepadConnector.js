import {NotepadConnectionState} from "./models.js";
import {notepadCore} from "./platform/platform-web.js";
import NotepadType from "./NotepadType.js";
import {create, optionalServices} from "./Notepad.js";

class NotepadConnector {
    constructor() {
        notepadCore.messageHandler = this._handleMessage.bind(this);
    }

    requestDevice() {
        return notepadCore.requestDevice({
            optionalServices: optionalServices,
        });
    }

    #notepadClient;
    #notepadType;

    connect(device) {
        this.#notepadClient = create(device);
        this.#notepadType = new NotepadType(this.#notepadClient);
        notepadCore.connect(device);
        if (this.connectionChangeHandler) this.connectionChangeHandler(this.#notepadClient, NotepadConnectionState.connecting);
    }

    disconnect() {
        this._clean();
        notepadCore.disconnect();
    }

    async _handleMessage(message) {
        console.log(`handleMessage ${message}`);
        if (message === NotepadConnectionState.connected) {
            await this.#notepadType.configCharacteristics();
            await this.#notepadClient.completeConnection();
            if (this.connectionChangeHandler) this.connectionChangeHandler(this.#notepadClient, NotepadConnectionState.connected);
        } else if (message === NotepadConnectionState.disconnected) {
            this._clean();
            if (this.connectionChangeHandler) this.connectionChangeHandler(this.#notepadClient, NotepadConnectionState.disconnected);
        }
    }

    connectionChangeHandler;

    // FIXME Listen to connection change
    _clean() {
        this.#notepadClient = null;
        this.#notepadType = null;
    }
}

export default NotepadConnector;
