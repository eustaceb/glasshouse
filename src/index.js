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
import {InstrumentContainer} from "./components/InstrumentContainer.js";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

function App(props) {
  const [initialised, setInitialised] = useState(false);

  const mouseController = useRef(null);
  const sampler = useRef(null);
  const playback = useRef(null);
  const composition = useRef(null);

  const start = function () {
    Tone.start();
    sampler.current.playBackgroundSample();
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
    sampler.current = new SampleController(data["samples"], players);
    playback.current = new PlaybackController(sampler.current);
    composition.current = new Composition(data["sections"], sampler.current);
    Tone.Transport.bpm.value = 100;
  };

  return (
    <div className="mainContainer">
      <div className="padding"></div>
      {initialised ? (
        <div className="componentsContainer">
          <div className="component componentA"></div>
          <InstrumentContainer
            instruments={[
              {
                name: "bass",
                graphics: {
                  base: "images/Section_1/bass.png",
                  hover: "images/Section_1/clap.png",
                },
              },
              {
                name: "stringArp",
                graphics: {
                  base: "images/Section_1/bass.png",
                  hover: "images/Section_1/clap.png",
                },
              },
              {
                name: "taiko",
                graphics: {
                  base: "images/Section_1/bass.png",
                  hover: "images/Section_1/clap.png",
                },
              },
              {
                name: "clap",
                graphics: {
                  base: "images/Section_1/bass.png",
                  hover: "images/Section_1/clap.png",
                },
              },
            ]}
          />
          <div className="component componentB"></div>
        </div>
      ) : (
        // <SamplePlayer
        //   composition={composition.current}
        //   sampler={sampler.current}
        //   mouseController={mouseController.current}
        // />
        <LoadingScreen
          start={() => start()}
          setup={(jsonData, players) => setup(jsonData, players)}
        />
      )}
      <div className="padding"></div>
      <div className="footerContainer">
        <div className="navigation"></div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
