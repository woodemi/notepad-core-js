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
}
