import {NotepadConnectionState} from "../models.js";
import EventEmitter from "../events.js";

const disconnectedEvent = "gattserverdisconnected";

class NotepadCoreWeb {
    requestDevice(scanOptions) {
        return navigator.bluetooth.requestDevice({
            optionalServices: scanOptions.optionalServices,
            acceptAllDevices: true,
        });
    }

    #connectGatt;

    async connect(device) {
        try {
            this.#connectGatt = await device.gatt.connect();
            this.#connectGatt.device.addEventListener(disconnectedEvent, this._handleDisconnectEvent.bind(this));
            console.log(`onConnectSuccess ${(this.#connectGatt)}, ${this.#connectGatt.connected}`);

            if (this.messageHandler) this.messageHandler(NotepadConnectionState.connected);
        } catch (e) {
            console.log(`onConnectFail ${e}`);
            if (this.messageHandler) this.messageHandler(NotepadConnectionState.disconnected);
        }
    }

    disconnect() {
        if (this.#connectGatt)
            this.#connectGatt.disconnect();
        if (this.#connectGatt && this.#connectGatt.device)
            this.#connectGatt.device.removeEventListener(disconnectedEvent, this._handleDisconnectEvent);
        this.#connectGatt = null;
    }

    _handleDisconnectEvent(event) {
        console.log(`_handleDisconnectEvent ${event.target}`);
        if (event.target !== this.#connectGatt.device) {
            console.log('Probably MEMORY LEAK!');
        }

        if (this.#connectGatt && this.#connectGatt.device)
            this.#connectGatt.device.removeEventListener(disconnectedEvent, this._handleDisconnectEvent);
        this.#connectGatt = null;
        if (this.messageHandler) this.messageHandler(NotepadConnectionState.disconnected);
    }

    messageHandler;

    async setNotifiable(serviceCharacteristic) {
        let characteristic = await getCharacteristic(this.#connectGatt, serviceCharacteristic);
        characteristic.startNotifications();
        characteristic.addEventListener("characteristicvaluechanged", this._onCharacteristicValueChange.bind(this));
    }

    async writeValue(serviceCharacteristic, value) {
        let characteristic = await getCharacteristic(this.#connectGatt, serviceCharacteristic);
        await characteristic.writeValue(value);
    }

    #inputValueEmitter = new EventEmitter();

    get inputValueEmitter() {
        return this.#inputValueEmitter;
    }

    _onCharacteristicValueChange(event) {
        let characteristic = event.target;
        let bytes = new Uint8Array(characteristic.value.buffer);
        console.log(`_onCharacteristicValueChange ${characteristic.uuid}, ${bytes}`);
        this.#inputValueEmitter.emit(characteristic.uuid, bytes);
    }
}

async function getCharacteristic(gatt, serviceCharacteristic) {
    let service = await gatt.getPrimaryService(serviceCharacteristic[0]);
    return await service.getCharacteristic(serviceCharacteristic[1]);
}

export const notepadCore = new NotepadCoreWeb();
