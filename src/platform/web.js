import EventEmitter from "../events.js";

const disconnectEvent = "gattserverdisconnected";
const valueChangeEvent = "characteristicvaluechanged";
const advertiseReceiveEvent = "advertisementreceived";

Number.prototype.toByteArray = function (byteLength, littleEndian = true) {
  let array = [];
  for (let i = 0; i < byteLength; i++) {
    const shift = 8 * (littleEndian ? i : byteLength - i);
    const byte = (this >> shift) & 0xFF;
    array.push(byte);
  }
  return Uint8Array.from(array);
};

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

  // FIXME Class field not supported in npm package for mini-wechat
  // _scan
  async startScan() {
    navigator.bluetooth.addEventListener(advertiseReceiveEvent, this._onAdvertisementReceived.bind(this));
    this._scan = await navigator.bluetooth.requestLEScan({ acceptAllAdvertisements: true });
  }

  stopScan() {
    this._scan.stop();
    navigator.bluetooth.removeEventListener(advertiseReceiveEvent, this._onAdvertisementReceived);
  }

  _onAdvertisementReceived(event) {
    console.debug(`_onAdvertisementReceived ${event.device.id}`);
    this.messageHandler({
      name: "scanResult",
      scanResult: {
        name: event.device.name,
        deviceId: event.device.id,
        manufacturerData: this._parseManufacturerData(event),
        RSSI: event.rssi
      }
    });
  }

  _parseManufacturerData(event) {
    if (event.manufacturerData.size == 0) return null;

    const [firstKey, firstValue] = event.manufacturerData.entries().next().value;
    return Uint8Array.from([
      ...firstKey.toByteArray(2 /*Short.SIZE_BYTES*/),
      ...new Uint8Array(firstValue.buffer)
    ]);
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
    if (this._connectGatt) {
      if (this._connectGatt.device) {
        this._connectGatt.device.removeEventListener(disconnectEvent, this._handleDisconnectEvent);
      }
      this._connectGatt.disconnect();
    }

    this._connectGatt = null;
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
    console.debug(`_onCharacteristicValueChange ${characteristic.uuid}, ${bytes}`);
    this._inputValueEmitter.emit(characteristic.uuid, bytes);
  }
}
