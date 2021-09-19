import React, {useRef, useEffect} from "react";
import ReactDOM from "react-dom";
import {SamplePlayer} from "./components/SamplePlayer.js";
import Grid from "@material-ui/core/Grid";
import {synthTheme} from "./theme.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {MouseController} from "./controllers/MouseController.js";
import {SampleController} from "./controllers/SampleController.js";
import {PlaybackController} from "./controllers/PlaybackController.js";
import * as Tone from "tone";
import "./style.css";

const mouseController = new MouseController(window.document);

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

function App(props) {
  const mouseController = useRef(props.mouseController);
  const sampler = useRef(new SampleController());
  const playback = useRef(new PlaybackController(sampler.current));

  useEffect(() => {
  });

  return (
    <ThemeProvider theme={synthTheme}>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={6}>
          <SamplePlayer
            sampler={sampler.current}
            mouseController={mouseController}
            playback={playback.current}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <App mouseController={mouseController} />,
  document.getElementById("root")
);
