const disconnectEvent = "gattserverdisconnected";

async function getCharacteristic(gatt, { serviceId, characteristicId }) {
  const service = await gatt.getPrimaryService(serviceId);
  return await service.getCharacteristic(characteristicId);
}

export default class NotepadCore {
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

  connect(scanResult) {
    console.info("NotepadCore connect");
    let that = this;
    scanResult.gatt.connect().then((result) => {
      console.debug("onConnectSuccess", result);
      that._connectGatt = result;
      that._connectGatt.device.addEventListener(disconnectEvent, this._handleDisconnectEvent.bind(this));
      // Connected
    }, (error) => {
      console.debug("onConnectFail", error);
      // Disconnected
    });
    // Connecting
  }

  disconnect() {
    console.info("NotepadCore disconnect");
    this._connectGatt.device.removeEventListener(disconnectEvent, this._handleDisconnectEvent);
    this.deviceId = null;
  }

  _handleDisconnectEvent(event) {
    console.debug("_handleDisconnectEvent", event.target.hashCode);

    this._connectGatt.device.removeEventListener(disconnectEvent, this._handleDisconnectEvent);
    // Disconnected
  }

  async setNotifiable({ serviceId, characteristicId }, state) {
    const characteristic = await getCharacteristic(this._connectGatt, { serviceId, characteristicId });
    if (state) {
      characteristic.startNotifications();
    } else {
      characteristic.stopNotifications();
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
}
