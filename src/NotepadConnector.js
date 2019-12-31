import {NotepadConnectionState} from "./models.js";

const disconnectedEvent = "gattserverdisconnected";

const SUFFIX = "ba5e-f4ee-5ca1-eb1e5e4b1ce0";

const SERV__COMMAND = `57444d01-${SUFFIX}`;
const CHAR__COMMAND_REQUEST = `57444e02-${SUFFIX}`;
const CHAR__COMMAND_RESPONSE = CHAR__COMMAND_REQUEST;

class NotepadConnector {
    requestDevice() {
        return navigator.bluetooth.requestDevice({
            optionalServices: [SERV__COMMAND],
            acceptAllDevices: true,
        });
    }

    #connectGatt;

    connect(device) {
        this.connect0(device);
        if (this.connectionChangeHandler) this.connectionChangeHandler(NotepadConnectionState.connecting);
    }

    async connect0(device) {
        try {
            this.#connectGatt = await device.gatt.connect();
            this.#connectGatt.device.addEventListener(disconnectedEvent, this.handleDisconnectEvent);
            console.log(`onConnectSuccess ${(this.#connectGatt)}, ${this.#connectGatt.connected}`);

            await this.configCharacteristics();
            await this.completeConnection();

            if (this.connectionChangeHandler) this.connectionChangeHandler(NotepadConnectionState.connected);
        } catch (e) {
            console.log(`onConnectFail ${e}`);
            if (this.connectionChangeHandler) this.connectionChangeHandler(NotepadConnectionState.disconnected);
        }
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

    async configCharacteristics() {
        await this.setNotifiable([SERV__COMMAND, CHAR__COMMAND_RESPONSE]);
    }

    async setNotifiable(serviceCharacteristic) {
        let characteristic = await getCharacteristic(this.#connectGatt, serviceCharacteristic);
        characteristic.startNotifications();
    }

    async completeConnection() {
        let request = Uint8Array.of(0x01, 0x0A, 0x00, 0x00, 0x00, 0x01);
        await this.sendRequestAsync("Command", [SERV__COMMAND, CHAR__COMMAND_REQUEST], request);
    }

    async sendRequestAsync(messageHead, serviceCharacteristic, request) {
        await this.writeValue(serviceCharacteristic, request);
        console.log(`on${messageHead}Send: ${request}`);
    }

    async writeValue(serviceCharacteristic, value) {
        let characteristic = await getCharacteristic(this.#connectGatt, serviceCharacteristic);
        await characteristic.writeValue(value);
    }
}

async function getCharacteristic(gatt, serviceCharacteristic) {
    let service = await gatt.getPrimaryService(serviceCharacteristic[0]);
    return await service.getCharacteristic(serviceCharacteristic[1]);
}

export default NotepadConnector;
