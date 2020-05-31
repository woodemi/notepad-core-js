import NotepadCoreWeb from "./web.js";
import NotepadCoreWechat from "./mini-wechat.js";

export const notepadCore = window && window.navigator ? new NotepadCoreWeb() : new NotepadCoreWechat();
