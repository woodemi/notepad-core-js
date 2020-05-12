import { NotepadConnector } from 'notepad-core';

const notepadConnector = new NotepadConnector();

Page({
    data: {},
    onLoad: function () {
    },
    bindStartScan: function () {
        notepadConnector.startScan();
    },
    bindStopScan: function () {
        notepadConnector.stopScan();
    },
});
