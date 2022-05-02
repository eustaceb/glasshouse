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
    setPopupOpen(true ^ popupOpen)
  }

  const popup = (
    <>
      <div className = {"popup" + (popupOpen ? "" : " hidden")}>
        <div className="colContainer">
          <div className="col">
            <div className="textContainer">
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
          </div>
          <div className="col">
            <div className="textContainer">
              <p><strong>Credits:</strong></p>
              <p><strong>Composition, production, mixing and sample selection:</strong> <br/> Guoda Diržytė</p>
              <p><strong>Vocals and lyrics:</strong> <br/> Maja Mihalik</p>
              <p><strong>Design and artwork:</strong> <br/> Gustav Freij</p>
              <p><strong>Back end software development:</strong> <br/> Justas Bikulčius</p>
              <p><strong>Front end software development:</strong> <br/> Danielius Šukys</p>
              <p><strong>Supported by:</strong></p>
              <div className='logoContainer'>
              <img src="images/popup/help_musicians_white.png" class="supporterLogo"/>
              <img src="images/popup/grant_white.png" class="supporterLogo"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={"popupClose"  + (popupOpen ? "" : " hidden")}>
        <div className="stick"></div>
        <div className="xButton"  onClick= { () => togglePopup() }></div>
      </div>
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
          <div id="about" className="corner" onClick= { () => togglePopup() }>about</div>
          <div id="mashangok" className="corner">Más Hangok</div>
          <div id="links" className="corner">
            <a href = "https://www.facebook.com/MasHangok" target="_blank" class="link">
              <img src="images/links/facebook.png"/>
            </a>
            <a href = "https://www.instagram.com/mashangok" target="_blank" class="link">
              <img src="images/links/instagram.png"/>
            </a>
            <a href = "https://www.youtube.com/channel/UCHt141D2QfGVt3paSsgZddw" target="_blank" class="link">
              <img src="images/links/youtube.png"/>
            </a>
            <a href = "https://open.spotify.com/artist/2fgJJlMfJdVNZDeuiLxwf4?si=dzFHueM1T_OvJdvEuPoc2A" target="_blank" class="link">
              <img src="images/links/spotify.png"/>
            </a>
            <a href = "https://mashangok.bandcamp.com" target="_blank" class="link">
              <img src="images/links/bc.png"/>
            </a>
          </div>
          <div id="glasshouse" className="corner">glasshouse</div>

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
