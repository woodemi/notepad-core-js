class NotepadCore {
    constructor() {
        wx.onBluetoothDeviceFound(this.onBluetoothDeviceFound);

        wx.pro.openBluetoothAdapter();
    }

    requestDevice() {
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

    onBluetoothDeviceFound({ devices }) {
        console.debug(`onBluetoothDeviceFound ${devices.length}`);
    }
}

export const miniWechat = new NotepadCore();