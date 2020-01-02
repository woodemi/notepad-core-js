import WoodemiClient from "./woodemi/WoodemiClient.js";

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
