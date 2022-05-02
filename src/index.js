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
    composition.current.startFx();
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
      <source src="images/bg_video.mp4" type="video/mp4" />
    </video>
    <img src="images/bg.png" className={"bgimg" + (initialised ? "" : "Loading")} />

    <div class = "popup">
      <div class="colContainer">
        <div class="col">
          <div class="textContainer">
            <p>
              5 friends from different backgrounds decided to make their lives just that one bit harder, challenge their friendship and combine their knowledge in sound, graphic design and programming in order to create this platform of sonic exploration.
            </p>
            <p>
              This project aims to let visitors interact with the music in a more collaborative way, to have people become part of the project, not external to it. Our aim is to enable the person interacting with our platform to always create something different, to engage mentally and emotionally.
            </p>
            <p>
              The samples on the site are taken from Glasshouse, the final track of Más Hangok EP entitled Contemporary Man.
            </p>
            <p>
              Más Hangok (2016-present) is a collaborative project between Lithuanian born Glasgow based composer & instrument designer Guoda Dirzyte and Hungarian born Brighton based vocalist & lyricist Maja Mihalik. As a collective, our work aims to explore the possibilities of new worlds by experimenting with various sonic cultures and music creation tools.
            </p>
            <p>
              You can listen to more of Más Hangok music on all major streaming platforms.
            </p>
          </div>
        </div>
        <div class="col">
          <div class="textContainer">
            <p>Credits:</p>
            <p>Composition, production, mixing and sample selection: Guoda Diržytė</p>
            <p>Vocals and lyrics: Maja Mihalik</p>
            <p>Design and artwork: Gustav Freij</p>
            <p>Back end software development: Justas Bikulčius</p>
            <p>Front end software development: Danielius Šukys</p>
            <p>Supported by</p>
            <p>LOGO</p>
          </div>
        </div>
      </div>
    </div>

    <div className={"mainContainer" + (initialised ? "" : "Loading")}>
      {initialised ? (
        <>
          <div className="padding">
            <div id="about">ABOUT</div>
          </div>
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
