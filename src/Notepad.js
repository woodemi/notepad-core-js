import WoodemiClient from "./woodemi/WoodemiClient.js";
import {NotePenPointer} from "./models.js";

export const optionalServices = WoodemiClient.optionalServices;

export function create(device) {
    // TODO Create according to manufacture data
    console.log(`create ${device}`);
    return new WoodemiClient();
}

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

export function parseSyncPointer(value) {
    let byteData = new DataView(value.buffer);
    return Array.from({length: value.length / 6}, (v, index) => {
        return new NotePenPointer(
            byteData.getUint16(index * 6, true),
            byteData.getUint16(index * 6 + 2, true),
            -1,
            byteData.getUint16(index * 6 + 4, true),
        );
    });
}
