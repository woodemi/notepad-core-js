import { web } from "./web.js";
import { miniWechat } from "./mini-wechat.js";

export const notepadCore = navigator.userAgent.match(/MicroMessenger/i) ? miniWechat : web;