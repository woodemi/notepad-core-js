import Head from 'next/head';
const {NotepadConnectionState, NotepadConnector} = require("../../../lib/index");
const {NotepadMode} = require("../../../lib/models");
const notepadConnector = new NotepadConnector();

async function bindRequestDevice() {
    this.device = await notepadConnector.requestDevice();
    console.log("requestDevice", this.device);
}

function bindConnect() {
    notepadConnector.connect(this.device);
}

function bindDisconnect() {
    notepadConnector.disconnect();
}

function bindSetMode() {
    this.notepadClient.setMode(NotepadMode.Sync);
}

const getCanvas = function () {
    if (!this.canvas) {
        this.canvas = document.getElementById("canvas");
    }
    return this.canvas;
};

const getScaleRatio = function () {
    if (!this.scaleRatio) {
        let rect = getCanvas().getBoundingClientRect();
        this.scaleRatio = Math.min(rect.width / 14800.0, rect.height / 21000.0);
    }
    return this.scaleRatio;
};

const handleSyncPointer = function (pointers) {
    let context = getCanvas().getContext("2d");
    let scaleRatio = getScaleRatio();
    for (let p of pointers) {
        let pre = this.prePointer ? this.prePointer.p : 0;
        if (pre <= 0 && p.p > 0) {
            context.beginPath();
            context.moveTo(p.x * scaleRatio, p.y * scaleRatio);
        } else if (pre > 0 && p.p > 0) {
            context.lineTo(p.x * scaleRatio, p.y * scaleRatio);
        } else if (pre > 0 && p.p <= 0) {
            context.stroke();
        }
        this.prePointer = p;
    }
};

notepadConnector.connectionChangeHandler = function (client, state) {
    console.log(`handleConnectionChange ${client}, ${state}`);
    switch (state) {
        case NotepadConnectionState.disconnected:
            if (this.notepadClient) this.notepadClient.syncPointerHandler = null;
            this.notepadClient = null;
            break;
        case NotepadConnectionState.connected:
            this.notepadClient = client;
            this.notepadClient.syncPointerHandler = handleSyncPointer;
            break;
    }
};

export default function Home() {
    return (
      <div className="container">
          <Head>
              <title>Notepad Demo</title>
              <link rel="icon" href="/favicon.ico"/>
          </Head>
          <main>
              <div className="grid">
                  <button onClick={bindRequestDevice}>RequestDevice</button>
                  <button onClick={bindConnect}>Connect</button>
                  <button onClick={bindDisconnect}>Disconnect</button>
                  <button onClick={bindSetMode}>setMode</button>
              </div>
              画布：
              <canvas id="canvas" className="canvas"/>
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
        
        canvas {
          width: 444px;
          height: 630px;
          background-color: #FEFEFE
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
