import NotepadCommand from "../NotepadCommand.js";

export const WOODEMI_PREFIX = new Uint8Array([87, 68, 77]);

const SUFFIX = "ba5e-f4ee-5ca1-eb1e5e4b1ce0";

export const SERV__COMMAND = `57444d01-${SUFFIX}`;
export const CHAR__COMMAND_REQUEST = `57444e02-${SUFFIX}`;
export const CHAR__COMMAND_RESPONSE = CHAR__COMMAND_REQUEST;

export const SERV__SYNC = `57444d06-${SUFFIX}`;
export const CHAR__SYNC_INPUT = `57444d07-${SUFFIX}`;

export const A1_WIDTH = 14800;
export const A1_HEIGHT = 21000;

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