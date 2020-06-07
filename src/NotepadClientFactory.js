import { WOODEMI_PREFIX } from "./woodemi/Woodemi.js";
import { optionalServices as WoodemiOptionalServices, WoodemiClient } from "./woodemi/WoodemiClient.js";

Uint8Array.prototype.startWith = function (prefix) {
  if (this.length < prefix.length) return false;
  
  for (let i in prefix) {
    if (this[i] != prefix[i]) return false;
  }
  return true;
};

export default class NotepadClientFactory {
  static support(scanResult) {
    return scanResult.manufacturerData && scanResult.manufacturerData.startWith(WOODEMI_PREFIX);
  }

  static create(scanResult) {
    // FIXME Support both native & web
    return new WoodemiClient(scanResult.manufacturerData);
  }

  static get optionalServiceCollection() {
    return [
      ...WoodemiOptionalServices
    ];
  }
}