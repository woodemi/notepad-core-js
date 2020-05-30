export const NotepadConnectionState = Object.freeze({
  Disconnected: Symbol('Disconnected'),
  Connecting: Symbol('Connecting'),
  AwaitConfirm: Symbol('AwaitConfirm'),
  Connected: Symbol('Connected')
});

export const NotepadMode = Object.freeze({
  Sync: Symbol("Sync"),
  Common: Symbol("Common"),
});

export class NotePenPointer {
  // FIXME Class field not supported in npm package for mini-wechat
  // x;
  // y;
  // t;
  // p;

  constructor(x, y, t, p) {
    this.x = x;
    this.y = y;
    this.t = t;
    this.p = p;
  }
}