class NotepadConnector {
    requestDevice() {
        return navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
        });
    }

    #connectGatt;

    async connect(device) {
        try {
            this.#connectGatt = await device.gatt.connect();
            console.log(`onConnectSuccess ${(this.#connectGatt)}, ${this.#connectGatt.connected}`);
        } catch (e) {
            console.log('onConnectFail');
        }
    }

    disconnect() {
        if (this.#connectGatt)
            this.#connectGatt.disconnect();
    }
}

export default NotepadConnector;
