import { NotepadConnector } from 'notepad-core';

const notepadConnector = new NotepadConnector();

Page({
    data: {
        scanResults: []
    },
    onLoad: function () {
        notepadConnector.scanResultHandler = this.handleScanResult.bind(this);
    },
    bindStartScan: function () {
        notepadConnector.startScan();
    },
    bindStopScan: function () {
        notepadConnector.stopScan();
    },
    handleScanResult: function(scanResult) {
        this.data.scanResults.push(scanResult);
        this.setData({ scanResults: this.data.scanResults });
    },
});
