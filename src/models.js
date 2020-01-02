export const NotepadConnectionState = {
    disconnected: 0,
    connecting: 1,
    connected: 2
};

export const NotepadMode = Object.freeze({
    Sync: Symbol("Sync"),
    Common: Symbol("Common"),
});

export class NotePenPointer {
    x;
    y;
    t;
    p;

    constructor(x, y, t, p) {
        this.x = x;
        this.y = y;
        this.t = t;
        this.p = p;
    }
}
