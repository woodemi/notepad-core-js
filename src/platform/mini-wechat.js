export default class NotepadCore {
  constructor() {
    wx.onBluetoothDeviceFound(this.onBluetoothDeviceFound.bind(this));

    wx.pro.openBluetoothAdapter();
  }

  requestDevice(scanOptions) {
    throw new Error("Unsupported");
  }

  async startScan() {
    console.info("NotepadCore startScan");
    let { available, discovering } = await wx.pro.getBluetoothAdapterState();
    if (available && !discovering) {
      wx.pro.startBluetoothDevicesDiscovery();
    }
  }

  stopScan() {
    console.info("NotepadCore stopScan");
    wx.pro.stopBluetoothDevicesDiscovery();
  }

  // FIXME Class field not supported in npm package for mini-wechat
  // messageHandler;
  onBluetoothDeviceFound({ devices }) {
    console.debug(`onBluetoothDeviceFound ${devices.length}`);
    if (!this.messageHandler) return;

    for (let d of devices) {
      let { name, deviceId, advertisData, RSSI } = d;
      let manufacturerData = new Uint8Array(advertisData);
      this.messageHandler({
        name: "scanResult",
        scanResult: { name, deviceId, manufacturerData, RSSI }
      });
    }
  }

  // FIXME Class field not supported in npm package for mini-wechat
  // _deviceId

  connect(scanResult) {
    console.info("NotepadCore connect");
    // TODO
    this._deviceId = scanResult.deviceId;
    wx.pro.createBLEConnection({ deviceId: this._deviceId });
  }

  disconnect() {
    console.info("NotepadCore disconnect");
    wx.pro.closeBLEConnection({ deviceId: this._deviceId });
    this._deviceId = null;
  }

  setNotifiable({ serviceId, characteristicId }, state) {
    return wx.pro.notifyBLECharacteristicValueChange({
      deviceId: this._deviceId,
      serviceId,
      characteristicId,
      state
    });
  }

  async requestMtu(expectedMtu) {
    // FIXME Android vs iOS
    await wx.pro.setBLEMTU(expectedMtu);
    return expectedMtu;
  }

  readValue({ serviceId, characteristicId }) {
    return wx.pro.readBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId,
      characteristicId
    });
  }

  async writeValue({ serviceId, characteristicId }, valueArray) {
    await wx.pro.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId,
      characteristicId,
      value: valueArray.buffer
    });
  }
}
