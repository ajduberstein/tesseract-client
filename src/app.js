/*global document*/
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

import DragAndDrop from './drag-and-drop';

import { createWorker } from 'tesseract.js';

const worker = createWorker();

function processImage(imgUri, setResult) {
    (async () => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        // await worker.setParameters
        const { data: { text } } = await worker.recognize(imgUri);
        setResult(text)
        await worker.terminate();
    })();
}

function ProgressBar() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const evFunc = (event) => {
        const msg = event.data;
        switch (msg.status) {
            case "progress":
                // ...handle progress message, progress is in `msg.progress`
                setMsg(msg.data.progress);
                break;
            case "data":
                // ...handle data message, data is in `msg.data`
                break;
        }
    }
    worker.worker.addEventListener('message', evFunc);
    return () => {
      worker.worker.removeEventListener('message', evFunc, false)
    }
  })
  if (!msg) {
    return <div></div>
  }
  if (msg === 1) {
    return <div></div>
  }
  return <div>{Math.round(msg*100)}% loaded</div>
}

function App() {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [result, setResult] = useState('');

  const imgEl = useRef(null);


  const onChangeImage = fileList => {
      const reader = new FileReader();
      reader.onload = function () {
        imgEl.current.src = reader.result;
        processImage(reader.result, setResult)
        imgEl.current.height = 200;
        setImgLoaded(true);
      }
      reader.readAsDataURL(fileList[0])
  }

  console.log(result);

  return (
    <div style={{display: 'flex', fontFamily: 'sans-serif', justifyContent: 'flex-start', alignItems: 'stretch', flexDirection: 'column'}}>
      <h1 style={{flex: 1, margin: 0}}>Client-side OCR</h1>
        <p style={{flex: 1}}>Model from tesseract.js</p>
        <ProgressBar style={{flex: 1}}/>
        <DragAndDrop style={{flex: 1}} handleDrop={onChangeImage}>
          <div style={{height: 300, width: 300}}>
            <div style={{background: '#1badaf', cursor: 'pointer'}}>
              Drop an image here to start
              <img ref={imgEl} type={"image/jpeg"}/>
            </div>
          </div>
        </DragAndDrop>
      <p>Output:</p>
      <div style={{fontFamily: 'monospace', maxWidth: '75%', whiteSpace: 'pre-line'}}>{result ? JSON.stringify(result).replaceAll('\\n', '\n') : '' }</div>
      </div>
  );
}

let appContainer = document.getElementById('app-container');
if (!appContainer) {
    appContainer = document.createElement('div');
    appContainer.id = 'app-container'
    document.body.appendChild(appContainer);
}

ReactDOM.render(
    <App />,
    appContainer
)
