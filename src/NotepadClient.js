import { WOODEMI_PREFIX } from "./woodemi/Woodemi.js";

Uint8Array.prototype.startWith = function (prefix) {
  if (this.length < prefix.length) return false;
  
  for (let i in prefix) {
    if (this[i] != prefix[i]) return false;
  }
  return true;
};

export default class NotepadClient {
  static support(scanResult) {
    if (scanResult.manufacturerData.startWith(WOODEMI_PREFIX)) {
      return true;
    }
    return false;
  }
}
