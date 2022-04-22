// Core libs
import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import * as Tone from "tone";

// MUI
import {Grid} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";

// Styling
import {synthTheme} from "./theme.js";
import "./style.css";

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
    const meter = new Tone.Meter();
    Tone.getDestination().connect(meter);
    setInterval(() => {
      const el = document.getElementById("level");
      const db = Math.round((meter.getValue() + Number.EPSILON) * 100) / 100;
      el.innerHTML = db.toString() + " db";
      if (db >= 0) {
        el.style.color = "red";
      } else if (db > -5) {
        el.style.color = "orange";
      } else {
        el.style.color = "black";
      }
    }, 100);
  };

  const setup = (data, players) => {
    mouseController.current = new MouseController(window.document);
    sampler.current = new SampleController(data["samples"], players);
    playback.current = new PlaybackController(sampler.current);
    composition.current = new Composition(data["sections"], sampler.current);
    Tone.Transport.bpm.value = 100;
  };

  return (
    <ThemeProvider theme={synthTheme}>
      {initialised ? (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={11}>
            <p style={{textAlign: "center"}} id="timestamp">
              0:0:0
            </p>
          </Grid>
          <Grid item xs={1}>
            <p id="level">0 db</p>
          </Grid>
          <SamplePlayer
            composition={composition.current}
            sampler={sampler.current}
            mouseController={mouseController.current}
          />
        </Grid>
      ) : (
        <LoadingScreen start={() => start()} setup={(jsonData, players) => setup(jsonData, players)} />
      )}
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
