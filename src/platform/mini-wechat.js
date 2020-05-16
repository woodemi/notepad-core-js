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
}
