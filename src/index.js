// Core libs
import React, {useState, useRef} from "react";
import ReactDOM from "react-dom";
import * as Tone from "tone";

// Controllers
import {Composition} from "./controllers/Composition.js";
import {MouseController} from "./controllers/MouseController.js";
import {PlaybackController} from "./controllers/PlaybackController.js";
import {SampleController} from "./controllers/SampleController.js";

// Components
import {AboutPopup, HelpPopup} from "./components/Popups.js";
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

  // Popups
  const [aboutOpen, setAboutOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const toggleHelp = () => {
    setAboutOpen(false);
    setHelpOpen(!helpOpen);
  }
  const toggleAbout = () => {
    setHelpOpen(false);
    setAboutOpen(!aboutOpen);
  }

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
      <video
        autoPlay
        muted
        loop
        className={"loopVideo" + (initialised ? "" : "Loading")}
        playbackrate="0.5">
        <source src="images/bg_video.mp4" type="video/mp4" />
      </video>
      <img
        src="images/bg.png"
        className={"bgimg" + (initialised ? "" : "Loading")}
      />
      {initialised ? <div className="darkBackgroundLayer" /> : null}
      {
        <AboutPopup
          toggle={() => setAboutOpen(!aboutOpen)}
          isOpen={aboutOpen}
        />
      }
      {<HelpPopup toggle={() => setHelpOpen(!helpOpen)} isOpen={helpOpen} />}

      <div
        id="mainContainer"
        className={"mainContainer" + (initialised ? "" : "Loading")}>
        {initialised ? (
          <>
            <div className="topRightContainer corner">
              <div
                id="about"
                className="nonselectable"
                onClick={toggleAbout}>
                about
              </div>
              <div
                id="questionmark"
                className="nonselectable blinkingSlow"
                onClick={toggleHelp}>
                ?
              </div>
            </div>

            <div id="mashangok" className="corner nonselectable">
              Más Hangok
            </div>
            <div id="links" className="corner">
              <a
                href="https://www.facebook.com/MasHangok"
                target="_blank"
                className="link">
                <img src="images/links/facebook.png" />
              </a>
              <a
                href="https://www.instagram.com/mashangok"
                target="_blank"
                className="link">
                <img src="images/links/instagram.png" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCHt141D2QfGVt3paSsgZddw"
                target="_blank"
                className="link">
                <img src="images/links/youtube.png" />
              </a>
              <a
                href="https://open.spotify.com/artist/2fgJJlMfJdVNZDeuiLxwf4?si=dzFHueM1T_OvJdvEuPoc2A"
                target="_blank"
                className="link">
                <img src="images/links/spotify.png" />
              </a>
              <a
                href="https://mashangok.bandcamp.com"
                target="_blank"
                className="link">
                <img src="images/links/bc.png" />
              </a>
              <a
                href="https://github.com/eustaceb/glasshouse"
                target="_blank"
                className="link">
                <img src="images/links/github.png" />
              </a>
            </div>
            <div id="glasshouse" className="corner nonselectable">
              glasshouse
            </div>

            <div className="topSpacing"></div>
            <SamplePlayer
              mouseController={mouseController.current}
              sampleController={sampleController.current}
              playback={playback.current}
              composition={composition.current}
            />
            <div className="bottomSpacing"></div>
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
