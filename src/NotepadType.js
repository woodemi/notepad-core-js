import {notepadCore} from "./platform/platform-web.js";

class NotepadType {
    #notepadClient;

    constructor(notepadClient) {
        this.#notepadClient = notepadClient;
        this.#notepadClient.notepadType = this;
    }

    async configCharacteristics() {
        for (let serviceCharacteristic of this.#notepadClient.inputIndicationCharacteristics) {
            await notepadCore.setNotifiable(serviceCharacteristic);
        }
        for (let serviceCharacteristic of this.#notepadClient.inputNotificationCharacteristics) {
            await notepadCore.setNotifiable(serviceCharacteristic);
        }
    }

    async sendRequestAsync(messageHead, serviceCharacteristic, request) {
        await notepadCore.writeValue(serviceCharacteristic, request);
        console.log(`on${messageHead}Send: ${request}`);
    }

    receiveResponseAsync(messageHead, serviceCharacteristic, predicate) {
        const [service, characteristic] = serviceCharacteristic;
        return new Promise(function (resolve, reject) {
            let filter = function (value) {
                if (predicate(value)) {
                    notepadCore.inputValueEmitter.removeListener(characteristic, filter);
                    console.log(`on${messageHead}Receive: ${characteristic} ${value}`);
                    resolve(value);
                }
            };
            notepadCore.inputValueEmitter.addListener(characteristic, filter);
        });
    }

    async executeCommand(command) {
        await this.sendRequestAsync("Command", this.#notepadClient.commandRequestCharacteristic, command.request);
        let value = await this.receiveResponseAsync("Command", this.#notepadClient.commandResponseCharacteristic, command.intercept);
        return command.handle(value);
    }

    receiveSyncInput(receiver) {
        const [service, characteristic] = this.#notepadClient.syncInputCharacteristic;
        notepadCore.inputValueEmitter.addListener(characteristic, receiver);
    }
}

export default NotepadType;
