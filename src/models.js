export const AccessResult = Object.freeze({
  Denied: Symbol('Denied'),           // Device claimed by other user
  Confirmed: Symbol('Confirmed'),     // Access confirmed, indicating device not claimed by anyone
  Unconfirmed: Symbol('Unconfirmed'), // Access unconfirmed, as user doesn't confirm before timeout
  Approved: Symbol('Approved')        // Device claimed by this user
});

export const AccessException = Object.freeze({
  Denied: new Error("Notepad claimed by other user"),
  Unconfirmed: new Error('User does not confirm before timeout'),
});

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
