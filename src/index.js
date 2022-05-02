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

  const [popupOpen, setPopupOpen] = useState(false);

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

  const togglePopup = function() {
    setPopupOpen(!popupOpen);
  }

  const popup = (
    <>
      <div className = {"popup" + (popupOpen ? "" : " hidden")}>
      <div className="label">
            <p><strong>About</strong></p>
        </div>
        <div className="row">
              <p>
                Five friends from different backgrounds decided to make their lives just that one bit harder, challenge their friendship and combine their knowledge in sound, graphic design and programming in order to create this platform of sonic exploration.
              </p>
              <p>
                This project aims to let visitors interact with the music in a more collaborative way, to have people become part of the project, not external to it. Our aim is to enable the person interacting with our platform to always create something different, to engage mentally and emotionally.
              </p>
              <p>
                The samples on the site are taken from Glasshouse, the final track of Más Hangok EP entitled Contemporary Man.
                Más Hangok (2016-present) is a collaborative project between Lithuanian born Glasgow based composer & instrument designer Guoda Dirzyte and Hungarian born Brighton based vocalist & lyricist Maja Mihalik. As a collective, our work aims to explore the possibilities of new worlds by experimenting with various sonic cultures and music creation tools.
              </p>
              <p>
                You can listen to more of Más Hangok music on all major streaming platforms.
              </p>
            </div>
        <div className="label">
            <p><strong>Credits</strong></p>
        </div>
        <div className="row">
          <div className="twoParagraphs">
            <p class="credit"><strong>Composition, production, mixing and sample selection</strong></p><p class="fullName">Guoda Diržytė</p>
            <p class="credit"><strong>Vocals and lyrics</strong></p><p class="fullName">Maja Mihalik</p>
          </div>
          <div className="twoParagraphs">
            <p class="credit"><strong>Design and artwork</strong></p><p class="fullName">Gustav Freij</p>
            <p class="credit"><strong>Software development</strong></p><p class="fullName">Justas Bikulčius<br />Danielius Šukys</p>
          </div>
        </div>
        <div className="row logoContainer">
          <p class="label">Supported by</p>
        <a href = "https://www.helpmusicians.org.uk/" target="_blank" className="link">
          <img src="images/popup/help_musicians_white.png" className="supporterLogo"/>
        </a>
        <a href = "https://www.artscouncil.org.uk/" target="_blank" className="link">
          <img src="images/popup/grant_white.png" className="supporterLogo"/>
        </a>
        </div>
      </div>
      <div className={"xButton"  + (popupOpen ? "" : " hidden")} onClick= { () => togglePopup() } />
    </>
  )


  return (
    <>
    <video autoPlay muted loop className={"loopVideo" + (initialised ? "" : "Loading")} playbackrate="0.5">
      <source src="images/bg_video.mp4" type="video/mp4" />
    </video>
    <img src="images/bg.png" className={"bgimg" + (initialised ? "" : "Loading")} />

    {popup}

    <div className={"mainContainer" + (initialised ? "" : "Loading")}>
      {initialised ? (
        <>
          <div id="about" className="corner nonselectable" onClick= { () => togglePopup() }>about</div>
          <div id="mashangok" className="corner nonselectable">Más Hangok</div>
          <div id="links" className="corner">
            <a href = "https://www.facebook.com/MasHangok" target="_blank" className="link">
              <img src="images/links/facebook.png"/>
            </a>
            <a href = "https://www.instagram.com/mashangok" target="_blank" className="link">
              <img src="images/links/instagram.png"/>
            </a>
            <a href = "https://www.youtube.com/channel/UCHt141D2QfGVt3paSsgZddw" target="_blank" className="link">
              <img src="images/links/youtube.png"/>
            </a>
            <a href = "https://open.spotify.com/artist/2fgJJlMfJdVNZDeuiLxwf4?si=dzFHueM1T_OvJdvEuPoc2A" target="_blank" className="link">
              <img src="images/links/spotify.png"/>
            </a>
            <a href = "https://mashangok.bandcamp.com" target="_blank" className="link">
              <img src="images/links/bc.png"/>
            </a>
          </div>
          <div id="glasshouse" className="corner nonselectable">glasshouse</div>

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
