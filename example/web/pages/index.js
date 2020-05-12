import Head from "next/head";

let notepadConnector;

import("notepad-core").then(({ NotepadConnector }) => {
   notepadConnector = new NotepadConnector();
});

async function bindRequestDevice() {
    await notepadConnector.requestDevice();
}

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
