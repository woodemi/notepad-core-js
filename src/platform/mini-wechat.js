import EventEmitter from "../events.js";

export default class NotepadCore {
  constructor() {
    wx.onBluetoothDeviceFound(this._onBluetoothDeviceFound.bind(this));
    wx.onBLEConnectionStateChange(this._onBLEConnectionStateChange.bind(this));
    wx.onBLECharacteristicValueChange(this._onBLECharacteristicValueChange.bind(this));

    wx.pro.openBluetoothAdapter();

    this._inputValueEmitter = new EventEmitter();
  }

  // FIXME Class field not supported in npm package for mini-wechat
  // _inputValueEmitter
  get inputValueEmitter() {
    return this._inputValueEmitter;
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

  _onBluetoothDeviceFound({ devices }) {
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

  async connect(scanResult) {
    console.info("NotepadCore connect");
    this._deviceId = scanResult.deviceId;
    await wx.pro.createBLEConnection({ deviceId: this._deviceId });
  }

  disconnect() {
    console.info("NotepadCore disconnect");
    // FIXME if (connected)
    wx.pro.closeBLEConnection({ deviceId: this._deviceId });
    this._deviceId = null;
  }

  _onBLEConnectionStateChange({ deviceId, connected }) {
    console.debug(`onBLEConnectionStateChange ${deviceId}, ${connected}`);
    if (connected) {
      this._discoverServices();
    } else {
      if (this.messageHandler) {
        this.messageHandler({
          name: "connectionState",
          connectionState: { connected: false }
        });
      }
    }
  }

  async _discoverServices() {
    await wx.pro.getBLEDeviceServices({
      deviceId: this._deviceId
    });
    if (this.messageHandler) {
      this.messageHandler({
        name: "connectionState",
        connectionState: { connected: true }
      });
    }
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

  _onBLECharacteristicValueChange({ characteristicId, value }) {
    const bytes = new Uint8Array(value);
    console.debug(`onBLECharacteristicValueChange ${characteristicId} ${bytes}`);
    // `MiniWechat` uses upper case in favor of iOS/macOS
    // While `Web` uses lower case in favor of Android/Windows
    // `Flutter` uses lower case for all above
    this._inputValueEmitter.emit(characteristicId.toLowerCase(), bytes);
  }
}
