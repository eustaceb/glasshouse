import React, {useState} from "react";
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

const mouseController = new MouseController(window.document);
const sampler = new SampleController();
const playback = new PlaybackController(sampler);
const composition = new Composition(sampler, 5, 5);

function StartModal(props) {
  return (
    <div className="startModal">
      <p>
        <a href="#" className="start" onClick={() => props.start()}>
          Start
        </a>
      </p>
    </div>
  );
}

function App(props) {
  const [initialised, setInitialised] = useState(false);

  const start = function () {
    Tone.start();
    props.sampler.playSampleByName("Bass Chorus");
    props.playback.start(0);
    // Start off with first sample playing
    setInitialised(true);
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
          <SamplePlayer composition={composition} sampler={props.sampler}/>
        </Grid>
      ) : (
        <StartModal start={() => start()} />
      )}
    </ThemeProvider>
  );
}

ReactDOM.render(
  <App
    mouseController={mouseController}
    sampler={sampler}
    playback={playback}
  />,
  document.getElementById("root")
);
