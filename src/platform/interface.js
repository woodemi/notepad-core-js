import { web } from "./web.js";
import { miniWechat } from "./mini-wechat.js";

export const notepadCore = wx ? miniWechat : web;
