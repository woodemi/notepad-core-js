class NotepadClient {
    get commandRequestCharacteristic() {
        throw new Error("Unimplemented");
    }

    get commandResponseCharacteristic() {
        throw new Error("Unimplemented");
    }

    get syncInputCharacteristic() {
        throw new Error("Unimplemented");
    }

    get inputIndicationCharacteristics() {
        throw new Error("Unimplemented");
    }

    notepadType;

    async completeConnection() {
        let [service, characteristic] = this.syncInputCharacteristic;
        // TODO removeListener
        this.notepadType.inputValueEmitter.addListener(characteristic, (value) => {
            console.log(`receiveSyncInput ${value}`);
        });
    }

    async setMode(notepadMode) {
        throw new Error("Unimplemented");
    }
}

export default NotepadClient;
