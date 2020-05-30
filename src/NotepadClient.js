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
    // TODO Stop receive
    this._notepadType.receiveSyncInput(function (value) {
      if (this._syncPointerReceiver) {
        this._syncPointerReceiver(this._parseSyncData(value));
      }
    }.bind(this));
  }

  //#region SyncInput
  async setMode(notepadMode) {
    throw new Error("Unimplemented");
  }

  _parseSyncData(value) {
    throw new Error("Unimplemented");
  }

  // FIXME Class field not supported in npm package for mini-wechat
  // _syncPointerReceiver

  onSyncPointerReceive(syncPointerReceiver) {
    // TODO addListener
    this._syncPointerReceiver = syncPointerReceiver;
  }

  offSyncPointerReceive(syncPointerReceiver) {
    // TODO removeListener
    this._syncPointerReceiver = null;
  }
  //#endregion
}
