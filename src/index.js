import React, {useRef, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {SamplePlayer} from "./components/SamplePlayer.js";
import Grid from "@material-ui/core/Grid";
import {synthTheme} from "./theme.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {MouseController} from "./controllers/MouseController.js";
import {SampleController} from "./controllers/SampleController.js";
import {PlaybackController} from "./controllers/PlaybackController.js";
import "./style.css";

const mouseController = new MouseController(window.document);

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

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
  const mouseController = useRef(props.mouseController);
  const sampler = useRef(new SampleController());
  const playback = useRef(new PlaybackController(sampler.current));
  const [initialised, setInitialised] = useState(false);

  const start = function () {
    playback.current.start(0.1);
    // Start off with first sample playing
    sampler.current.playSample(0);
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
          <Grid item xs={12}>
            <SamplePlayer
              sampler={sampler.current}
              mouseController={mouseController}
              playback={playback.current}
            />
          </Grid>
        </Grid>
      ) : (
        <StartModal start={() => start()} />
      )}
    </ThemeProvider>
  );
}

ReactDOM.render(
  <App mouseController={mouseController} />,
  document.getElementById("root")
);
