import {notepadCore} from "./platform/platform-web.js";

class NotepadType {
    #notepadClient;

    constructor(notepadClient) {
        this.#notepadClient = notepadClient;
        this.#notepadClient.notepadType = this;
    }

    async configCharacteristics() {
        await notepadCore.setNotifiable(this.#notepadClient.commandResponseCharacteristic);
    }

    async sendRequestAsync(messageHead, serviceCharacteristic, request) {
        await notepadCore.writeValue(serviceCharacteristic, request);
        console.log(`on${messageHead}Send: ${request}`);
    }
}

export default NotepadType;
