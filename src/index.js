import * as Tone from "tone";
import React, {useRef, useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {SamplePlayer} from "./components/SamplePlayer.js";
import Grid from "@material-ui/core/Grid";
import {synthTheme} from "./theme.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {MouseController} from "./controllers/MouseController.js";
import {Sequencer} from "./components/Sequencer.js";

const samples = [
  {
    name: "hihats",
    path: "audio/hihats.mp3",
    buffer: new Tone.Buffer("audio/hihats.mp3"),
    isLooping: false,
    color: "#800080",
  },
  {
    name: "synth",
    path: "audio/synth.mp3",
    buffer: new Tone.Buffer("audio/synth.mp3"),
    isLooping: false,
    color: "#800020",
  },
];

const mouseController = new MouseController(window.document);

function App(props) {
  const mouseController = useRef(props.mouseController);
  const [selectedSampleIndex, setSample] = useState(0);

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
            samples={props.samples}
            selectedSampleIndex={selectedSampleIndex}
          />
        </Grid>
        <Grid item xs={6}>
          <SamplePlayer
            samples={props.samples}
            selectedSampleIndex={selectedSampleIndex}
            setSample={setSample}
            mouseController={mouseController}
          />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

ReactDOM.render(
  <App samples={samples} mouseController={mouseController} />,
  document.getElementById("root")
);
