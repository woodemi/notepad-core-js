import { notepadCore } from "./platform/interface.js";

export default class NotepadType {
  // FIXME Class field not supported in npm package for mini-wechat
  // _notepadClient

  constructor(notepadClient) {
    this._notepadClient = notepadClient;
    notepadClient._notepadType = this;
  }

  async configCharacteristics() {
    for (let serviceCharacteristic of this._notepadClient.inputIndicationCharacteristics) {
      await notepadCore.setNotifiable(serviceCharacteristic, true);
    }
    for (let serviceCharacteristic of this._notepadClient.inputNotificationCharacteristics) {
      await notepadCore.setNotifiable(serviceCharacteristic, true);
    }
  }

  async sendRequestAsync(messageHead, serviceCharacteristic, request) {
    await notepadCore.writeValue(serviceCharacteristic, request);
    console.log(`on${messageHead}Send: ${request}`);
  }

  receiveResponseAsync(messageHead, serviceCharacteristic, predicate) {
    const { serviceId, characteristicId } = serviceCharacteristic;
    return new Promise(function (resolve, reject) {
      const filter = function (value) {
        if (predicate(value)) {
          notepadCore.inputValueEmitter.removeListener(characteristicId, filter);
          console.log(`on${messageHead}Receive: ${characteristicId} ${value}`);
          resolve(value);
        }
      };
      notepadCore.inputValueEmitter.addListener(characteristicId, filter);
    });
  }

  async executeCommand(command) {
    await this.sendRequestAsync("Command", this._notepadClient.commandRequestCharacteristic, command.request);
    const value = await this.receiveResponseAsync("Command", this._notepadClient.commandResponseCharacteristic, command.intercept);
    return command.handle(value);
  }

  receiveSyncInput(receiver) {
    const { serviceId, characteristicId } = this._notepadClient.syncInputCharacteristic;
    // TODO removeListener
    notepadCore.inputValueEmitter.addListener(characteristicId, receiver);
  }
}
