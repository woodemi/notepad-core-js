import Head from 'next/head';
import React from 'react';

let notepadConnector;

export default class Home extends React.Component {
  state = {
    results: [],
    device: null,
    notepadClient: null
  };

  componentDidMount() {
    // Dynamic import, see https://github.com/vercel/next.js/issues/9890#issuecomment-569822580
    import("notepad-core").then((NotepadCore) => {
      notepadConnector = NotepadCore.notepadConnector;
      notepadConnector.onConnectionChange(this.onConnectionChange.bind(this));
    });
  }

  componentWillUnmount() {
    notepadConnector.offConnectionChange(this.onConnectionChange);
  }

  onConnectionChange(notepadClient, connectionState) {
    console.log("onConnectionChange", notepadClient, connectionState);
    if (connectionState === NotepadConnectionState.Connected) {
      this.setState({ notepadClient });
    } else if (connectionState === NotepadConnectionState.Disconnected) {
      this.setState({ notepadClient: null });
    }
  }

  bindRequestDevice = async () => {
    const device = await notepadConnector.requestDevice();
    this.setState({ device });
  };

  insertResult(message) {
    this.setState({
      results: this.state.results.push(message)
    });
  }

  bindConnect = () => {
    notepadConnector.connect(this.state.device);
  };

  bindDisconnect = () => {
    notepadConnector.disconnect();
  };

  bindClaimAuth() {
    notepadConnector.claimAuth()
      .then(() => {
        this.insertResult('绑定设备成功');
      })
      .catch((err) => {
        this.insertResult('绑定设备失败:' + err);
      });
  }

  bindDisclaimAuth() {
    notepadConnector.disclaimAuth()
      .then(() => {
        this.insertResult('解除绑定成功');
      })
      .catch((err) => {
        this.insertResult('解除绑定失败:' + err);
      });
  }

  bindSetMode() {
    notepadConnector.setMode(NotepadMode.Sync)
      .then(() => {
        this.insertResult('设置Mode成功');
      })
      .catch((err) => {
        this.insertResult('设置Mode失败:' + err);
      });
  }

  bindGetMemoSummary() {
    notepadConnector.getMemoSummary()
      .then((memoSummary) => {
        this.insertResult('获取队列摘要成功:' + memoSummary);
      })
      .catch((err) => {
        this.insertResult('获取队列摘要失败:' + err);
      });
  }

  bindImportMemo() {
    notepadConnector.importMemo()
      .then(() => {
        this.insertResult('导入单个离线笔迹成功');
      })
      .catch((err) => {
        this.insertResult('导入单个离线笔迹失败:' + err);
      });
  }

  bindDeleteMemo() {
    notepadConnector.deleteMemo()
      .then(() => {
        this.insertResult('删除单个离线笔迹成功');
      })
      .catch((err) => {
        this.insertResult('删除单个离线笔迹失败:' + err);
      });
  }

  bindGetDeviceName() {
    notepadConnector.getDeviceName()
      .then((deviceName) => {
        this.insertResult('获取设备名称成功:' + deviceName);
      })
      .catch((err) => {
        this.insertResult('获取设备名称失败:' + err);
      });
  }

  bindDeviceNameInput(ev) {
    this.setData({
      deviceName: ev.target.value
    });
  }

  bindSetDeviceName() {
    notepadConnector.setDeviceName(this.data.deviceName)
      .then(() => {
        this.insertResult('设置设备名称成功');
      })
      .catch((err) => {
        this.insertResult('设置设备名称失败:' + err);
      });
  }

  bindGetBatteryInfo() {
    notepadConnector.getBatteryInfo()
      .then((batteryInfo) => {
        this.insertResult('获取电量信息成功:' + batteryInfo);
      })
      .catch((err) => {
        this.insertResult('获取电量信息失败:' + err);
      });
  }

  bindGetDeviceDate() {
    notepadConnector.getDeviceDate()
      .then((deviceDate) => {
        this.insertResult('获取设备时钟成功:' + deviceDate);
      })
      .catch((err) => {
        this.insertResult('获取设备时钟失败:' + err);
      });
  }

  bindDeviceDateInput(ev) {
    this.setData({
      deviceDate: ev.target.value
    });
  }

  bindSetDeviceDate() {
    notepadConnector.setDeviceDate(this.data.deviceDate)
      .then(() => {
        this.insertResult('设置设备时钟成功');
      })
      .catch((err) => {
        this.insertResult('设置设备时钟失败:' + err);
      });
  }

  bindGetAutoLockTime() {
    notepadConnector.getAutoLockTime()
      .then((autoLockTime) => {
        this.insertResult('获取设备自动休眠时长成功:' + autoLockTime);
      })
      .catch((err) => {
        this.insertResult('获取设备自动休眠时长失败:' + err);
      });
  }

  bindAutoLockTimeInput(ev) {
    this.setData({
      autoLockTime: ev.target.autoLockTime
    });
  }

  bindSetAutoLockTime() {
    notepadConnector.setAutoLockTime(this.data.autoLockTime)
      .then(() => {
        this.insertResult('设置设备自动休眠时长成功');
      })
      .catch((err) => {
        this.insertResult('设置设备自动休眠时长成功');
      });
  }


  bindUpgradePathInput(ev) {
    this.setData({
      upgradePath: ev.target.value
    });
  }

  bindUpgradeVersionInput(ev) {
    this.setData({
      upgradeVersion: ev.target.value
    });
  }

  bindUpgrade() {
    notepadConnector.upgrade(this.data.upgradePath, this.data.upgradeVersion)
      .then(() => {
        this.insertResult('设置设备自动休眠时长成功');
      })
      .catch((err) => {
        this.insertResult('设置设备自动休眠时长成功');
      });
  }

  render() {
    let resultsView = [];
    const results = this.state.results;
    for (let i = 0; i < results.length; i++) {
      resultsView.push(<li>{results[results.length - i]}</li>);
    }
    return (
      <div className="container">
        <Head>
          <title>Notepad Demo</title>
          <link rel="icon" href="/favicon.ico"/>
        </Head>
        <main>
          <div className="grid">
            <button onClick={this.bindRequestDevice}>RequestDevice</button>
            <button onClick={this.bindConnect}>Connect</button>
            <button onClick={this.bindDisconnect}>Disconnect</button>
            <button onClick={this.bindClaimAuth}>ClaimAuth</button>
            <button onClick={this.bindDisclaimAuth}>DisclaimAuth</button>
            <button onClick={this.bindSetMode}>SetMode</button>
            <button onClick={this.bindGetMemoSummary}>GetMemoSummary</button>
            <button onClick={this.bindImportMemo}>ImportMemo</button>
            <button onClick={this.bindDeleteMemo}>DeleteMemo</button>
            <button onClick={this.bindGetDeviceName}>GetDeviceName</button>
                      设备名称：<input value={this.state.deviceName} onChange={this.bindDeviceNameInput}/>
            <button onClick={this.bindSetDeviceName}>SetDeviceName</button>
            <button onClick={this.bindGetBatteryInfo}>GetBatteryInfo</button>
            <button onClick={this.bindGetDeviceDate}>GetDeviceDate</button>
                      设备时钟（秒）：<input type="number" value={this.state.deviceDate} onChange={this.bindDeviceDateInput}/>
            <button onClick={this.bindSetDeviceDate}>SetDeviceDate</button>
            <button onClick={this.bindGetAutoLockTime}>GetAutoLockTime</button>
                      休眠时长（分）：<input type="number" value={this.state.autoLockTime} onChange={this.bindAutoLockTimeInput}/>
            <button onClick={this.bindSetAutoLockTime}>SetAutoLockTime</button>
                      选择更新文件：<input type="file" value={this.state.upgradePath} onChange={this.bindUpgradePathInput}/>
                      版本号：<input value={this.state.upgradeVersion} onChange={this.bindUpgradeVersionInput}/>
            <button onClick={this.bindUpgrade}>Upgrade</button>
                      笔记范围：
                      W:{this.state.width || '未知'},H:{this.state.height || '未知'}
                      操作结果：
            <resultsView/>
          </div>
        </main>
        <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        
        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
        }
        
        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

        <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
      </div>
    );
  }
}
