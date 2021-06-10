import * as Tone from "tone";
import React, {useRef, useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {SamplePlayer} from "./components/SamplePlayer.js";
import Grid from "@material-ui/core/Grid";
import {synthTheme} from "./theme.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {MouseController} from "./controllers/MouseController.js";
import {SampleController} from "./controllers/SampleController.js";
import {Sequencer} from "./components/Sequencer.js";
import {PlaybackController} from "./controllers/PlaybackController.js";

const mouseController = new MouseController(window.document);

function App(props) {
  const mouseController = useRef(props.mouseController);
  const [sampler, setSampler] = useState(new SampleController());
  const [playback, setPlayback] = useState(new PlaybackController());

  useEffect(() => {
    Tone.Transport.start();

    return () => {
      Tone.Transport.stop();
    };
  });

  return (
    <ThemeProvider theme={synthTheme}>
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Sequencer
            sampler={sampler}
            playback={playback}
          />
        </Grid>
        <Grid item xs={6}>
          <SamplePlayer sampler={sampler} mouseController={mouseController} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <App mouseController={mouseController} />,
  document.getElementById("root")
);
