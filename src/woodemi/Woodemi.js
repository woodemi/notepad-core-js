import NotepadCommand from "../NotepadCommand.js";

const getDefaultIntercept = function (request) {
    return (value) => value[0] === 0x07 && value[1] === request[0];
};

const defaultHandle = function (response) {
    if (response[4] !== 0x00) throw new Error(`WOODEMI_COMMAND fail: response ${response}`);
};

export class WoodemiCommand extends NotepadCommand {
    constructor(request, intercept, handle) {
        super(
            request,
            intercept ? intercept : getDefaultIntercept(request),
            handle ? handle : defaultHandle,
        );
    }
}
