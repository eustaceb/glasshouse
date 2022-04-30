// Core libs
import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import * as Tone from "tone";
import css from "./style.css";
import BgVideo from "./images/bg_video.mp4";
import BgImage from "./images/bg.png";

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
  };

  const setup = (data, players) => {
    mouseController.current = new MouseController(window.document);
    sampleController.current = new SampleController(data["samples"], players);
    playback.current = new PlaybackController(sampleController.current);
    composition.current = new Composition(
      data["sections"],
      sampleController.current
    );
    Tone.Transport.bpm.value = 100;
  };

  return (
    <>
    <video autoPlay muted loop className={"loopVideo" + (initialised ? "" : "Loading")} playbackrate="0.5">
      <source src={BgVideo} type="video/mp4" />
    </video>
    <img src={BgImage} className={"bgimg" + (initialised ? "" : "Loading")} />
    <div className={"mainContainer" + (initialised ? "" : "Loading")}>
      {initialised ? (
        <>
          <div className="padding"></div>
          <SamplePlayer
            mouseController={mouseController.current}
            sampleController={sampleController.current}
            playback={playback.current}
            composition={composition.current}
          />
          <div className="padding"></div>
        </>
      ) : (
        <LoadingScreen
          start={() => start()}
          setup={(jsonData, players) => setup(jsonData, players)}
        />
      )}
    </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
