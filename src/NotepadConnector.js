import {NotepadConnectionState} from "./models.js";
import {notepadCore} from "./platform/platform-web.js";

const SUFFIX = "ba5e-f4ee-5ca1-eb1e5e4b1ce0";

const SERV__COMMAND = `57444d01-${SUFFIX}`;
const CHAR__COMMAND_REQUEST = `57444e02-${SUFFIX}`;
const CHAR__COMMAND_RESPONSE = CHAR__COMMAND_REQUEST;

class NotepadConnector {
    constructor() {
        notepadCore.messageHandler = this.handleMessage.bind(this);
    }

    requestDevice() {
        return notepadCore.requestDevice({
            optionalServices: [SERV__COMMAND],
        });
    }

    connect(device) {
        notepadCore.connect(device);
        if (this.connectionChangeHandler) this.connectionChangeHandler(NotepadConnectionState.connecting);
    }

    disconnect() {
        notepadCore.disconnect();
    }

    async handleMessage(message) {
        console.log(`handleMessage ${message}`);
        if (message === NotepadConnectionState.connected) {
            await this.configCharacteristics();
            await this.completeConnection();
            if (this.connectionChangeHandler) this.connectionChangeHandler(NotepadConnectionState.connected);
        } else if (message === NotepadConnectionState.disconnected) {
            if (this.connectionChangeHandler) this.connectionChangeHandler(NotepadConnectionState.disconnected);
        }
    }

    connectionChangeHandler;

    async configCharacteristics() {
        await notepadCore.setNotifiable([SERV__COMMAND, CHAR__COMMAND_RESPONSE]);
    }

    async completeConnection() {
        let request = Uint8Array.of(0x01, 0x0A, 0x00, 0x00, 0x00, 0x01);
        await this.sendRequestAsync("Command", [SERV__COMMAND, CHAR__COMMAND_REQUEST], request);
    }

    async sendRequestAsync(messageHead, serviceCharacteristic, request) {
        await notepadCore.writeValue(serviceCharacteristic, request);
        console.log(`on${messageHead}Send: ${request}`);
    }
}

export default NotepadConnector;
