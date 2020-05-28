import NotepadClient from "../NotepadClient.js";
import {
  SERV__COMMAND,
  CHAR__COMMAND_REQUEST,
  CHAR__COMMAND_RESPONSE,
  SERV__SYNC,
  CHAR__SYNC_INPUT,
  WoodemiCommand
} from "./Woodemi.js";
import { AccessResult, AccessException } from "../models.js";

export const optionalServices = [SERV__COMMAND, SERV__SYNC];

export class WoodemiClient extends NotepadClient {
  get commandRequestCharacteristic() {
    return { serviceId: SERV__COMMAND, characteristicId: CHAR__COMMAND_REQUEST };
  }

  get commandResponseCharacteristic() {
    return { serviceId: SERV__COMMAND, characteristicId: CHAR__COMMAND_RESPONSE };
  }

  get syncInputCharacteristic() {
    return { serviceId: SERV__SYNC, characteristicId: CHAR__SYNC_INPUT };
  }

  get inputIndicationCharacteristics() {
    return [
      this.commandResponseCharacteristic
    ];
  }

  get inputNotificationCharacteristics() {
    return [
      this.syncInputCharacteristic
    ];
  }

  async completeConnection(awaitConfirmHandler) {
    const accessResult = await this._checkAccess(awaitConfirmHandler);
    switch (accessResult) {
    case AccessResult.Denied:
      throw AccessException.Denied;
    case AccessResult.Unconfirmed:
      throw AccessException.Unconfirmed;
    }
  }

  //#region authorization
  async _checkAccess(awaitConfirmHandler) {
    const response = await this._notepadType.executeCommand(new WoodemiCommand(
      Uint8Array.of(0x01, 0x0A, 0x00, 0x00, 0x00, 0x01),
      (value) => value[0] === 0x02,
      (value) => value[1],
    ));
    switch (response) {
    case 0x00:
      return AccessResult.Denied;
    case 0x01: {
      awaitConfirmHandler(true);
      const confirm = await this._notepadType.receiveResponseAsync("Confirm",
        this.commandResponseCharacteristic, (value) => value[0] === 0x03);
      return confirm[1] === 0x00 ? AccessResult.Confirmed : AccessResult.Unconfirmed;
    }
    case 0x02:
      return AccessResult.Approved;
    default:
      throw new Error("Unknown error");
    }
  }
  //#endregion
}
