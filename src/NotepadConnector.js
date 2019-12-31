class NotepadConnector {
    requestDevice() {
        return navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
        });
    }
}

export default NotepadConnector;
