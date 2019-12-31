import WoodemiClient from "./woodemi/WoodemiClient.js";

export const optionalServices = WoodemiClient.optionalServices;

export function create(device) {
    // TODO Create according to manufacture data
    console.log(`create ${device}`);
    return new WoodemiClient();
}
