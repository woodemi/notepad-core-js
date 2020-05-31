import NotepadConnector from "./src/NotepadConnector.js";
import { NotepadConnectionState, NotepadMode } from "./src/models";

const notepadConnector =  new NotepadConnector();

export {
  notepadConnector,
  NotepadConnectionState,
  NotepadMode,
};