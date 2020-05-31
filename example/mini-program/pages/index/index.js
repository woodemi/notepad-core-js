import { notepadConnector } from 'notepad-core';

Page({
  data: {
    scanResults: []
  },
  onLoad: function () {
    notepadConnector.onScanResult(this.onScanResult.bind(this));
  },
  onUnload: function () {
    notepadConnector.offScanResult(this.onScanResult);
  },

  bindStartScan: function () {
    notepadConnector.startScan();
  },
  bindStopScan: function () {
    notepadConnector.stopScan();
  },
  onScanResult: function(scanResult) {
    this.data.scanResults.push(scanResult);
    this.setData({ scanResults: this.data.scanResults });
  },

  bindTapItem: function (event) {
    const index = event.currentTarget.dataset.index;
    const scanResult = this.data.scanResults[index];
    wx.navigateTo({
      url: '../notepad/notepad',
      success: (res) => res.eventChannel.emit("scanResult", { scanResult })
    });
  },
});


