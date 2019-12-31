import {NotepadConnectionState} from "./models.js";

const disconnectedEvent = "gattserverdisconnected";

class NotepadConnector {
    requestDevice() {
        return navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
        });
    }

    #connectGatt;

    connect(device) {
        const self = this;
        device.gatt.connect().then((result) => {
            self.#connectGatt = result;
            console.log(`onConnectSuccess ${(self.#connectGatt)}, ${self.#connectGatt.connected}`);
            this.#connectGatt.device.addEventListener(disconnectedEvent, self.handleDisconnectEvent);

            if (self.connectionChangeHandler) self.connectionChangeHandler(NotepadConnectionState.connected);
        }, (error) => {
            console.log(`onConnectFail ${error}`);
            if (self.connectionChangeHandler) self.connectionChangeHandler(NotepadConnectionState.disconnected);
        });

        if (this.connectionChangeHandler) this.connectionChangeHandler(NotepadConnectionState.connecting);
    }

    disconnect() {
        if (this.#connectGatt) {
            this.#connectGatt.disconnect();
            this.#connectGatt.device.removeEventListener(disconnectedEvent, this.handleDisconnectEvent);
        }
        this.#connectGatt = null;
    }

    handleDisconnectEvent(event) {
        console.log(`handleDisconnectEvent ${event}`);
        // FIXME this refer to `BluetoothDevice`
        // if (this.connectionChangeHandler) this.connectionChangeHandler(NotepadConnectionState.disconnected);
    }

    connectionChangeHandler;
}

export default NotepadConnector;
