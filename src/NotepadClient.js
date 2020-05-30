export default class NotepadClient {
  get commandRequestCharacteristic() {
    throw new Error("Unimplemented");
  }

  get commandResponseCharacteristic() {
    throw new Error("Unimplemented");
  }

  get inputIndicationCharacteristics() {
    throw new Error("Unimplemented");
  }

  get inputNotificationCharacteristics() {
    throw new Error("Unimplemented");
  }

  // FIXME Class field not supported in npm package for mini-wechat
  // _notepadType

  async completeConnection(awaitConfirmHandler) {
    throw new Error("Unimplemented");
  }

  //#region SyncInput
  async setMode(notepadMode) {
    throw new Error("Unimplemented");
  }
  //#endregion
}
