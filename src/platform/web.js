import EventEmitter from "../events.js";

const disconnectEvent = "gattserverdisconnected";
const valueChangeEvent = "characteristicvaluechanged";

async function getCharacteristic(gatt, { serviceId, characteristicId }) {
  const service = await gatt.getPrimaryService(serviceId);
  return await service.getCharacteristic(characteristicId);
}

export default class NotepadCore {
  constructor() {
    this._inputValueEmitter = new EventEmitter();
  }

  // FIXME Class field not supported in npm package for mini-wechat
  // _inputValueEmitter
  get inputValueEmitter() {
    return this._inputValueEmitter;
  }

  requestDevice(scanOptions) {
    return navigator.bluetooth.requestDevice({
      optionalServices: scanOptions.optionalServices,
      acceptAllDevices: true,
    });
  }

  startScan() {
    throw new Error("Unsupported");
  }

  stopScan() {
    throw new Error("Unsupported");
  }

  async connect(scanResult) {
    console.info("NotepadCore connect");
    try {
      this._connectGatt = await scanResult.gatt.connect();
      console.debug("onConnectSuccess", this._connectGatt);
      this._connectGatt.device.addEventListener(disconnectEvent, this._handleDisconnectEvent.bind(this));
      if (this.messageHandler) {
        this.messageHandler({
          name: "connectionState",
          connectionState: { connected: true }
        });
      }
    } catch (e) {
      console.debug("onConnectFail", e);
      if (this.messageHandler) {
        this.messageHandler({
          name: "connectionState",
          connectionState: { connected: false }
        });
      }
    }
  }

  disconnect() {
    console.info("NotepadCore disconnect");
    this._connectGatt.device.removeEventListener(disconnectEvent, this._handleDisconnectEvent);
    this.deviceId = null;
  }

  _handleDisconnectEvent(event) {
    console.debug("_handleDisconnectEvent", event.target.hashCode);

    if (this._connectGatt && this._connectGatt.device) {
      this._connectGatt.device.removeEventListener(disconnectEvent, this._handleDisconnectEvent);
    }
    this._connectGatt = null;

    if (this.messageHandler) {
      this.messageHandler({
        name: "connectionState",
        connectionState: { connected: false }
      });
    }
  }

  async setNotifiable({ serviceId, characteristicId }, state) {
    const characteristic = await getCharacteristic(this._connectGatt, { serviceId, characteristicId });
    if (state) {
      characteristic.startNotifications();
      characteristic.addEventListener(valueChangeEvent, this._onCharacteristicValueChange.bind(this));
    } else {
      characteristic.stopNotifications();
      characteristic.removeEventListener(valueChangeEvent, this._onCharacteristicValueChange);
    }
  }

  async requestMtu(expectedMtu) {
    return 104; // mac
  }

  async readValue({ serviceId, characteristicId }) {
    const characteristic = await getCharacteristic(this._connectGatt, { serviceId, characteristicId });
    characteristic.readValue(); // then
  }

  async writeValue({ serviceId, characteristicId }, valueArray) {
    const characteristic = await getCharacteristic(this._connectGatt, { serviceId, characteristicId });
    await characteristic.writeValue(valueArray);
  }

  _onCharacteristicValueChange(event) {
    const characteristic = event.target;
    const bytes = new Uint8Array(characteristic.value.buffer);
    console.log(`_onCharacteristicValueChange ${characteristic.uuid}, ${bytes}`);
    this._inputValueEmitter.emit(characteristic.uuid, bytes);
  }
}
