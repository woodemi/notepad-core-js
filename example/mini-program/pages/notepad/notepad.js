import { notepadConnector, NotepadConnectionState, NotepadMode } from 'notepad-core';

Page({
  data: {
    results: []
  },
  scanResult: null,
  notepadClient: null,
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('scanResult', (data) => {
      this.scanResult = data.scanResult;
    });
    
    notepadConnector.onConnectionChange(this.onConnectionChange.bind(this));
  },

  onUnload: function() {
    notepadConnector.offConnectionChange(this.onConnectionChange);
  },

  onConnectionChange: function(notepadClient, connectionState) {
    console.log("onConnectionChange", notepadClient, connectionState);
    if (connectionState === NotepadConnectionState.Connected) {
      this.notepadClient = notepadClient;
    } else if (connectionState === NotepadConnectionState.Disconnected) {
      this.notepadClient = null;
    }
  },

  insertResult(result) {
    this.setData({
      results: this.data.results.push(result)
    });
  },

  bindConnect() {
    notepadConnector.connect(this.scanResult);
  },

  bindDisconnect() {
    notepadConnector.disconnect();
  },

  bindClaimAuth() {
    notepadConnector.claimAuth()
      .then(() => {
        this.insertResult('绑定设备成功');
      })
      .catch((err) => {
        this.insertResult('绑定设备失败', err);
      });
  },
  bindDisclaimAuth() {
    notepadConnector.disclaimAuth()
      .then(() => {
        this.insertResult('解除绑定成功');
      })
      .catch((err) => {
        this.insertResult('解除绑定失败', err);
      });
  },
  bindSetMode() {
    this.notepadClient.setMode(NotepadMode.Sync)
      .then(() => {
        this.insertResult('设置Mode成功');
      })
      .catch((err) => {
        this.insertResult('设置Mode失败', err);
      });
  },
  bindGetMemoSummary() {
    notepadConnector.getMemoSummary()
      .then((memoSummary) => {
        this.insertResult('获取队列摘要成功', memoSummary);
      })
      .catch((err) => {
        this.insertResult('获取队列摘要失败', err);
      });
  },
  bindImportMemo() {
    notepadConnector.importMemo()
      .then(() => {
        this.insertResult('导入单个离线笔迹成功');
      })
      .catch((err) => {
        this.insertResult('导入单个离线笔迹失败', err);
      });
  },
  bindDeleteMemo() {
    notepadConnector.deleteMemo()
      .then(() => {
        this.insertResult('删除单个离线笔迹成功');
      })
      .catch((err) => {
        this.insertResult('删除单个离线笔迹失败', err);
      });
  },
  bindGetDeviceName() {
    notepadConnector.getDeviceName()
      .then((deviceName) => {
        this.insertResult('获取设备名称成功', deviceName);
      })
      .catch((err) => {
        this.insertResult('获取设备名称失败', err);
      });
  },
  bindDeviceNameInput(ev) {
    this.setData({
      deviceName: ev.detail.value
    });
  },

  bindSetDeviceName() {
    notepadConnector.setDeviceName(this.data.deviceName)
      .then(() => {
        this.insertResult('设置设备名称成功');
      })
      .catch((err) => {
        this.insertResult('设置设备名称失败', err);
      });
  },
  bindGetBatteryInfo() {
    notepadConnector.getBatteryInfo()
      .then((batteryInfo) => {
        this.insertResult('获取电量信息成功', batteryInfo);
      })
      .catch((err) => {
        this.insertResult('获取电量信息失败', err);
      });
  },
  bindGetDeviceDate() {
    notepadConnector.getDeviceDate()
      .then((deviceDate) => {
        this.insertResult('获取设备时钟成功', deviceDate);
      })
      .catch((err) => {
        this.insertResult('获取设备时钟失败', err);
      });
  },

  bindDeviceDateInput(ev) {
    this.setData({
      deviceDate: ev.detail.value
    });
  },
  bindSetDeviceDate() {
    notepadConnector.setDeviceDate(this.data.deviceDate)
      .then(() => {
        this.insertResult('设置设备时钟成功');
      })
      .catch((err) => {
        this.insertResult('设置设备时钟失败', err);
      });
  },
  bindGetAutoLockTime() {
    notepadConnector.getAutoLockTime()
      .then((autoLockTime) => {
        this.insertResult('获取设备自动休眠时长成功', autoLockTime);
      })
      .catch((err) => {
        this.insertResult('获取设备自动休眠时长失败', err);
      });
  },

  bindAutoLockTimeInput(ev) {
    this.setData({
      autoLockTime: ev.detail.autoLockTime
    });
  },

  bindSetAutoLockTime() {
    notepadConnector.setAutoLockTime(this.data.autoLockTime)
      .then(() => {
        this.insertResult('设置设备自动休眠时长成功');
      })
      .catch((err) => {
        this.insertResult('设置设备自动休眠时长成功');
      });
  },


  bindUpgradePathInput(ev) {
    this.setData({
      upgradePath: ev.detail.value
    });
  },

  bindUpgradeVersionInput(ev) {
    this.setData({
      upgradeVersion: ev.detail.value
    });
  },

  bindUpgrade() {
    notepadConnector.upgrade(this.data.upgradePath, this.data.upgradeVersion)
      .then(() => {
        this.insertResult('设置设备自动休眠时长成功');
      })
      .catch((err) => {
        this.insertResult('设置设备自动休眠时长成功');
      });
  }
});