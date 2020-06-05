import NotepadCommand from "../NotepadCommand.js";

export const WOODEMI_PREFIX = new Uint8Array([87, 68, 77]);

const SUFFIX = "ba5e-f4ee-5ca1-eb1e5e4b1ce0";

export const SERV__COMMAND = `57444d01-${SUFFIX}`;
export const CHAR__COMMAND_REQUEST = `57444e02-${SUFFIX}`;
export const CHAR__COMMAND_RESPONSE = CHAR__COMMAND_REQUEST;

export const SERV__SYNC = `57444d06-${SUFFIX}`;
export const CHAR__SYNC_INPUT = `57444d07-${SUFFIX}`;

export const UGEE_CN = new Uint8Array([0x41, 0x35]);
export const UGEE_GLOBAL = new Uint8Array([0x41, 0x36]);
export const EMRIGHT_CN = new Uint8Array([0x41, 0x37]);

/**
 * +---A1P--+
 * |        |
 * |  +A1+  |
 * |  |  |  |
 * |  |  |  |
 * |  +--+  |
 * |        |
 * +--------+
 */
class WoodemiType {
  constructor(widthOutline, heightOutline, scale, widthPadding, heightPadding, pScale) {
    this.widthOutline = widthOutline;
    this.heightOutline = heightOutline;
    this.scale = scale;
    this.widthPadding = widthPadding;
    this.heightPadding = heightPadding;
    this.pScale = pScale;
  }

  get left() {
    return this.widthPadding;
  }

  get right() {
    return this.widthOutline - this.widthPadding;
  }

  get top() {
    return this.heightPadding;
  }

  get bottom() {
    return this.heightOutline - this.heightPadding;
  }
}

export const typeA1 = new WoodemiType(14800, 21000, 1, 0, 0, 1);
export const typeA1P = new WoodemiType(30000, 42400, 2, 200, 200, 4);

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