// Core libs
import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import * as Tone from "tone";

// Controllers
import {Composition} from "./controllers/Composition.js";
import {MouseController} from "./controllers/MouseController.js";
import {PlaybackController} from "./controllers/PlaybackController.js";
import {SampleController} from "./controllers/SampleController.js";

// Components
import {LoadingScreen} from "./components/LoadingScreen.js";
import {SamplePlayer} from "./components/SamplePlayer.js";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

function App(props) {
  const [initialised, setInitialised] = useState(false);

  const mouseController = useRef(null);
  const sampleController = useRef(null);
  const playback = useRef(null);
  const composition = useRef(null);

  const start = function () {
    Tone.start();
    sampleController.current.playBackgroundSample();
    playback.current.start(0);
    // Start off with first sample playing
    setInitialised(true);

    // Setup meter
    // const meter = new Tone.Meter();
    // Tone.getDestination().connect(meter);
    // setInterval(() => {
    //   const el = document.getElementById("level");
    //   const db = Math.round((meter.getValue() + Number.EPSILON) * 100) / 100;
    //   el.innerHTML = db.toString() + " db";
    //   if (db >= 0) {
    //     el.style.color = "red";
    //   } else if (db > -5) {
    //     el.style.color = "orange";
    //   } else {
    //     el.style.color = "black";
    //   }
    // }, 100);
  };

  const setup = (data, players) => {
    mouseController.current = new MouseController(window.document);
    sampleController.current = new SampleController(data["samples"], players);
    playback.current = new PlaybackController(sampleController.current);
    composition.current = new Composition(data["sections"], sampleController.current);
    Tone.Transport.bpm.value = 100;
  };

  return (
    <div className="mainContainer">
      <div className="padding"></div>
      {initialised ? (
        <SamplePlayer
          mouseController={mouseController.current}
          sampleController={sampleController.current}
          playback={playback.current}
          composition={composition.current}
        />
      ) : (
        <LoadingScreen
          start={() => start()}
          setup={(jsonData, players) => setup(jsonData, players)}
        />
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
