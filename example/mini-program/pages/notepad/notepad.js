import { NotepadConnector, NotepadMode } from 'notepad-core';
const AUTH_TOKEN = '';
Page({
  data: {
    scanResult: null,
    results: [],
  },
  props: {},
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('scanResult', function (data) {
      this.props.scanResult = data.scanResult;
    });
  },

  insertResult(result) {
    this.setData({
      results: this.data.results.push(result)
    });
  },

  bindConnect() {
    NotepadConnector.connect(this.props.scanResult, AUTH_TOKEN)
      .then((notepadClient, ConnectionState) => {
        this.props.notepadClient = notepadClient;
        this.props.notepadClient.onReceiveNotePenPointers((NotePenPointers) => {
          this.insertResult('接收实时笔迹', NotePenPointers);
        });
        this.props.notepadClient.onImportMemoProgress((progress) => {
          this.insertResult('导入笔记进度', progress);
        });
        this.props.notepadClient.onUpgradeProgress((progress) => {
          this.insertResult('升级设备进度', progress);
        });
        this.setData({
          width: notepadClient.width,
          height: notepadClient.height,
        });
        this.insertResult('连接设备成功', ConnectionState);
      })
      .catch((err) => {
        this.insertResult('连接设备失败', err);
      });
  },

  bindDisconnect() {
    NotepadConnector.disconnect()
      .then(() => {
        this.insertResult('解除连接成功');
      })
      .catch((err) => {
        this.insertResult('解除连接失败', err);
      });
  },

  bindClaimAuth() {
    NotepadConnector.claimAuth()
      .then(() => {
        this.insertResult('绑定设备成功');
      })
      .catch((err) => {
        this.insertResult('绑定设备失败', err);
      });
  },
  bindDisclaimAuth() {
    NotepadConnector.disclaimAuth()
      .then(() => {
        this.insertResult('解除绑定成功');
      })
      .catch((err) => {
        this.insertResult('解除绑定失败', err);
      });
  },
  bindSetMode() {
    NotepadConnector.setMode(NotepadMode.Sync)
      .then(() => {
        this.insertResult('设置Mode成功');
      })
      .catch((err) => {
        this.insertResult('设置Mode失败', err);
      });
  },
  bindGetMemoSummary() {
    NotepadConnector.getMemoSummary()
      .then((memoSummary) => {
        this.insertResult('获取队列摘要成功', memoSummary);
      })
      .catch((err) => {
        this.insertResult('获取队列摘要失败', err);
      });
  },
  bindImportMemo() {
    NotepadConnector.importMemo()
      .then(() => {
        this.insertResult('导入单个离线笔迹成功');
      })
      .catch((err) => {
        this.insertResult('导入单个离线笔迹失败', err);
      });
  },
  bindDeleteMemo() {
    NotepadConnector.deleteMemo()
      .then(() => {
        this.insertResult('删除单个离线笔迹成功');
      })
      .catch((err) => {
        this.insertResult('删除单个离线笔迹失败', err);
      });
  },
  bindGetDeviceName() {
    NotepadConnector.getDeviceName()
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
    NotepadConnector.setDeviceName(this.data.deviceName)
      .then(() => {
        this.insertResult('设置设备名称成功');
      })
      .catch((err) => {
        this.insertResult('设置设备名称失败', err);
      });
  },
  bindGetBatteryInfo() {
    NotepadConnector.getBatteryInfo()
      .then((batteryInfo) => {
        this.insertResult('获取电量信息成功', batteryInfo);
      })
      .catch((err) => {
        this.insertResult('获取电量信息失败', err);
      });
  },
  bindGetDeviceDate() {
    NotepadConnector.getDeviceDate()
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
    NotepadConnector.setDeviceDate(this.data.deviceDate)
      .then(() => {
        this.insertResult('设置设备时钟成功');
      })
      .catch((err) => {
        this.insertResult('设置设备时钟失败', err);
      });
  },
  bindGetAutoLockTime() {
    NotepadConnector.getAutoLockTime()
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
    NotepadConnector.setAutoLockTime(this.data.autoLockTime)
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
    NotepadConnector.upgrade(this.data.upgradePath, this.data.upgradeVersion)
      .then(() => {
        this.insertResult('设置设备自动休眠时长成功');
      })
      .catch((err) => {
        this.insertResult('设置设备自动休眠时长成功');
      });
  }
});