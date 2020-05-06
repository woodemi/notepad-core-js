import NotepadClient from "../NotepadClient.js";
import {WoodemiCommand} from "./Woodemi.js";
import {NotepadMode} from "../models.js";
import {AccessException, AccessResult, parseSyncPointer} from "../Notepad.js";

const SUFFIX = "ba5e-f4ee-5ca1-eb1e5e4b1ce0";

const SERV__COMMAND = `57444d01-${SUFFIX}`;
const CHAR__COMMAND_REQUEST = `57444e02-${SUFFIX}`;
const CHAR__COMMAND_RESPONSE = CHAR__COMMAND_REQUEST;

const SERV__SYNC = `57444d06-${SUFFIX}`;
const CHAR__SYNC_INPUT = `57444d07-${SUFFIX}`;

const A1_WIDTH = 14800;
const A1_HEIGHT = 21000;

class WoodemiClient extends NotepadClient {
    static optionalServices = [SERV__COMMAND, SERV__SYNC];

    get commandRequestCharacteristic() {
        return [SERV__COMMAND, CHAR__COMMAND_REQUEST];
    }

    get commandResponseCharacteristic() {
        return [SERV__COMMAND, CHAR__COMMAND_RESPONSE];
    }

    get syncInputCharacteristic() {
        return [SERV__SYNC, CHAR__SYNC_INPUT];
    }

    get inputIndicationCharacteristics() {
        return [
            this.commandResponseCharacteristic,
        ];
    }

    get inputNotificationCharacteristics() {
        return [
            this.syncInputCharacteristic,
        ];
    }

    async completeConnection() {
        let accessResult = await this._checkAccess();
        switch (accessResult) {
            case AccessResult.Denied:
                throw AccessException.Denied;
            case AccessResult.Unconfirmed:
                throw AccessException.Unconfirmed;
            default:
                break;
        }

        await super.completeConnection();
    }

    async _checkAccess() {
        let response = await this.notepadType.executeCommand(new WoodemiCommand(
            Uint8Array.of(0x01, 0x0A, 0x00, 0x00, 0x00, 0x01),
            (value) => value[0] === 0x02,
            (value) => value[1],
        ));
        switch (response) {
            case 0x00:
                return AccessResult.Denied;
            case 0x01: {
                const confirm = await this.notepadType.receiveResponseAsync("Confirm",
                    this.commandResponseCharacteristic, (value) => value[0] === 0x03);
                return confirm[1] === 0x00 ? AccessResult.Confirmed : AccessResult.Unconfirmed;
            }
            case 0x02:
                return AccessResult.Approved;
            default:
                throw new Error("Unknown error");
        }
    }

    async setMode(notepadMode) {
        let mode = notepadMode === NotepadMode.Sync ? 0x00 : 0x01;
        await this.notepadType.executeCommand(new WoodemiCommand(
            Uint8Array.of(0x05, mode)
        ));
    }

    _parseSyncData(value) {
        return parseSyncPointer(value).filter((pointer) => {
            return 0 <= pointer.x && pointer.x <= A1_WIDTH
                && 0 <= pointer.y && pointer.y <= A1_HEIGHT;
        });
    }
}

export default WoodemiClient;
