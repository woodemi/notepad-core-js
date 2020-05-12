import {NotepadConnectionState, NotepadConnector, NotepadMode} from 'notepad-core';

const notepadConnector = new NotepadConnector();

Page({
    data: {},
    handleSyncPointer: function (pointers) {
        let context = this.canvas.getContext("2d");
        for (let p of pointers) {
            let pre = this.prePointer ? this.prePointer.p : 0;
            if (pre <= 0 && p.p > 0) {
                context.beginPath();
                context.moveTo(p.x * this.scaleRatio, p.y * this.scaleRatio);
            } else if (pre > 0 && p.p > 0) {
                context.lineTo(p.x * this.scaleRatio, p.y * this.scaleRatio);
            } else if (pre > 0 && p.p <= 0) {
                context.stroke();
            }
            this.prePointer = p;
        }
    },
    onLoad: function () {
        notepadConnector.connectionChangeHandler = function (client, state) {
            console.log(`handleConnectionChange ${client}, ${state}`);
            switch (state) {
                case NotepadConnectionState.disconnected:
                    if (this.notepadClient) this.notepadClient.syncPointerHandler = null;
                    this.notepadClient = null;
                    break;
                case NotepadConnectionState.connected:
                    this.notepadClient = client;
                    this.notepadClient.syncPointerHandler = this.handleSyncPointer;
                    break;
            }
        };

        const query = wx.createSelectorQuery();
        query.select('#myCanvas')
          .fields({ node: true, size: true })
          .exec((res) => {
              this.canvas = res[0].node;
              const ctx = this.canvas.getContext('2d');
              const dpr = wx.getSystemInfoSync().pixelRatio;
              this.canvas.width = res[0].width * dpr;
              this.canvas.height = res[0].height * dpr;
              this.scaleRatio = Math.min(res[0].width / 14800.0, res[0].height / 21000.0);
              ctx.scale(dpr, dpr);
          });
    },
    bindRequestDevice: function () {
        this.device = notepadConnector.requestDevice();
        console.log("requestDevice", this.device);
    },

    bindConnect: function () {
        if (!this.device) {
            wx.showToast({
                title: '请先调用 requestDevice',
                icon: 'none',
            });
        }
        notepadConnector.connect(this.device);
    },
    bindDisconnect: function () {
        notepadConnector.disconnect();
    },
    bindSetMode: function () {
        this.notepadClient.setMode(NotepadMode.Sync);
    }
});
