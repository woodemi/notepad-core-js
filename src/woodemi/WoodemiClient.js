import NotepadClient from "../NotepadClient.js";

const SUFFIX = "ba5e-f4ee-5ca1-eb1e5e4b1ce0";

const SERV__COMMAND = `57444d01-${SUFFIX}`;
const CHAR__COMMAND_REQUEST = `57444e02-${SUFFIX}`;
const CHAR__COMMAND_RESPONSE = CHAR__COMMAND_REQUEST;

class WoodemiClient extends NotepadClient {
    static optionalServices = [SERV__COMMAND];

    get commandRequestCharacteristic() {
        return [SERV__COMMAND, CHAR__COMMAND_REQUEST];
    }

    get commandResponseCharacteristic() {
        return [SERV__COMMAND, CHAR__COMMAND_RESPONSE];
    }

    async completeConnection() {
        let request = Uint8Array.of(0x01, 0x0A, 0x00, 0x00, 0x00, 0x01);
        await this.notepadType.sendRequestAsync("Command", this.commandRequestCharacteristic, request);
    }
}

export default WoodemiClient;
