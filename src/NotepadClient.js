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
}

export default NotepadClient;
