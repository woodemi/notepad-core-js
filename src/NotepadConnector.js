import { notepadCore } from "./platform/interface.js";
import NotepadClientFactory from "./NotepadClientFactory.js";
import NotepadType from "./NotepadType.js";
import { NotepadConnectionState } from "./models.js";

class NotepadConnector {
  constructor() {
    notepadCore.messageHandler = this._handleMessage.bind(this);
  }

  requestDevice() {
    console.info("NotepadConnector requestDevice");
    return notepadCore.requestDevice({
      optionalServices: NotepadClientFactory.optionalServiceCollection
    });
  }

  startScan() {
    console.info("NotepadConnector startScan");
    notepadCore.startScan();
  }

  stopScan() {
    console.info("NotepadConnector stopScan");
    notepadCore.stopScan();
  }

  onScanResult() {}


  // FIXME Class field not supported in npm package for mini-wechat
  // _notepadClient
  // _notepadType

  connect(scanResult, authToken) {
    console.info("NotepadConnector connect");
    this._notepadClient = NotepadClientFactory.create(scanResult);
    this._notepadType = new NotepadType(this._notepadClient);
    notepadCore.connect(scanResult);
    if (this._connectionChangeHandler) this._connectionChangeHandler(this._notepadClient, NotepadConnectionState.Connecting);
  }

  disconnect() {
    console.info("NotepadConnector disconnect");
    this._clean();
    notepadCore.disconnect();
  }

  _handleMessage(message) {
    console.debug("NotepadConnector _handleMessage", message);
    if (message.name === "scanResult") {
      if (NotepadClientFactory.support(message.scanResult) && this.scanResultHandler)
        this.scanResultHandler(message.scanResult);
    } else if (message.name === "connectionState") {
      this._handleConnectionState(message.connectionState);
    }
  }

  // FIXME Class field not supported in npm package for mini-wechat
  // _connectionChangeHandler

  onConnectionChange(connectionChangeHandler) {
    // TODO addListener
    this._connectionChangeHandler = connectionChangeHandler;
  }

  offConnectionChange(connectionChangeHandler) {
    // TODO removeListener
    this._connectionChangeHandler = null;
  }

  async _handleConnectionState({ connected }) {
    if (connected) {
      try {
        await this._notepadType.configCharacteristics();
        await this._notepadClient.completeConnection((awaitConfirm) => {
          if (this._connectionChangeHandler) this._connectionChangeHandler(this._notepadClient, NotepadConnectionState.AwaitConfirm);
        });
        if (this._connectionChangeHandler) this._connectionChangeHandler(this._notepadClient, NotepadConnectionState.Connected);
      } catch (e) {
        this._clean();
      }
    } else {
      this._clean();
      if (this._connectionChangeHandler) this._connectionChangeHandler(this._notepadClient, NotepadConnectionState.Disconnected);
    }
  }

  _clean() {
    this._notepadClient = null;
  }
}

export default NotepadConnector;
