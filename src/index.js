import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import {SamplePlayer} from "./components/SamplePlayer.js";
import {Grid} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import {synthTheme} from "./theme.js";
import * as Tone from "tone";
import {MouseController} from "./controllers/MouseController.js";
import {Composition} from "./controllers/Composition.js";
import {PlaybackController} from "./controllers/PlaybackController.js";
import {SampleController} from "./controllers/SampleController.js";
import "./style.css";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

function StartModal(props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("composition.json")
      .then((res) => res.json())
      .then(
        (result) => {
          props.setup(result);
          setLoaded(true);
        },
        (error) => {
          console.log(error);
          setError(true);
        }
      );
  }, []);

  return (
    <div className="startModal">
      <p>
        {loaded ? (
          <a href="#" className="start" onClick={() => props.start()}>
            Start
          </a>
        ) : error ? (
          `Error`
        ) : (
          "Loading..."
        )}
      </p>
    </div>
  );
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
  };

  const setup = (data) => {
    mouseController.current = new MouseController(window.document);
    sampler.current = new SampleController(data["samples"]);
    playback.current = new PlaybackController(sampler.current);
    composition.current = new Composition(data["sections"], sampler.current);
    Tone.Transport.bpm.value = 100;
  };

  return (
    <ThemeProvider theme={synthTheme}>
      {initialised ? (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <p style={{textAlign: "center"}} id="timestamp">
              0:0:0
            </p>
          </Grid>
          <SamplePlayer
            composition={composition.current}
            sampler={sampler.current}
            mouseController={mouseController.current}
          />
        </Grid>
      ) : (
        <StartModal start={() => start()} setup={(data) => setup(data)} />
      )}
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
