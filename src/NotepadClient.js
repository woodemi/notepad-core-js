class NotepadClient {
    get commandRequestCharacteristic() {
        throw new Error("Unimplemented");
    }

    get commandResponseCharacteristic() {
        throw new Error("Unimplemented");
    }

    notepadType;

    async completeConnection() {
    }

    async setMode(notepadMode) {
        throw new Error("Unimplemented");
    }
}

export default NotepadClient;
