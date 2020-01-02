export const NotepadConnectionState = {
    disconnected: 0,
    connecting: 1,
    connected: 2
};

export const NotepadMode = Object.freeze({
    Sync: Symbol("Sync"),
    Common: Symbol("Common"),
});
