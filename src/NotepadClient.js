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
        // TODO Stop receive
        this.notepadType.receiveSyncInput(function (value) {
            if (this.syncPointerHandler) this.syncPointerHandler(this._parseSyncData(value));
        }.bind(this));
    }

    syncPointerHandler;

    async setMode(notepadMode) {
        throw new Error("Unimplemented");
    }

    _parseSyncData(value) {
        throw new Error("Unimplemented");
    }
}

export default NotepadClient;
