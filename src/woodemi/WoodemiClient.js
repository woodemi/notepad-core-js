import NotepadClient from "../NotepadClient.js";
import * as Woodemi from "./Woodemi.js";
import { AccessResult, AccessException, parseSyncPointer } from "../utils.js";
import { NotepadMode, NotePenPointer } from "../models.js";

export const optionalServices = [Woodemi.SERV__COMMAND, Woodemi.SERV__SYNC];

const WoodemiCommand = Woodemi.WoodemiCommand;

export class WoodemiClient extends NotepadClient {
  // FIXME Class field not supported in npm package for mini-wechat
  // _woodemiType

  constructor(data) {
    super();
    const type = data.slice(3, 5);
    const isCompact = type.startWith(Woodemi.UGEE_CN) || type.startWith(Woodemi.UGEE_GLOBAL);
    this._woodemiType = isCompact ? Woodemi.typeA1 : Woodemi.typeA1P;
  }

  get commandRequestCharacteristic() {
    return { serviceId: Woodemi.SERV__COMMAND, characteristicId: Woodemi.CHAR__COMMAND_REQUEST };
  }

  get commandResponseCharacteristic() {
    return { serviceId: Woodemi.SERV__COMMAND, characteristicId: Woodemi.CHAR__COMMAND_RESPONSE };
  }

  get syncInputCharacteristic() {
    return { serviceId: Woodemi.SERV__SYNC, characteristicId: Woodemi.CHAR__SYNC_INPUT };
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

    super.completeConnection(awaitConfirmHandler);
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

  //#region SyncInput
  async setMode(notepadMode) {
    let mode = notepadMode === NotepadMode.Sync ? 0x00 : 0x01;
    await this._notepadType.executeCommand(new WoodemiCommand(
      Uint8Array.of(0x05, mode)
    ));
  }

  _parseSyncData(value) {
    return parseSyncPointer(value).map((pointer) => {
      const type = this._woodemiType;
      const x = (Math.max(type.left, Math.min(pointer.x, type.right)) - type.left) / type.scale;
      const y = (Math.max(type.top, Math.min(pointer.y, type.bottom)) - type.top) / type.scale;
      const p = pointer.p / type.pScale;
      return new NotePenPointer(Math.trunc(x), Math.trunc(y), pointer.t, Math.trunc(p));
    });
  }
  //#endregion
}
