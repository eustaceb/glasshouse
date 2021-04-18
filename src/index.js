import * as Tone from "tone";
import React, {useRef} from "react";
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
  },
  {
    name: "synth",
    path: "audio/synth.mp3",
    buffer: new Tone.Buffer("audio/synth.mp3"),
    isLooping: false,
  },
];

function App(props) {
  const mouseController = useRef(new MouseController(window.document));

  return (
    <ThemeProvider theme={synthTheme}>
      <Grid container justify="center" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <Sequencer/>
        </Grid>
        <Grid item xs={12}>
            <SamplePlayer
              samples={props.samples}
              mouseController={mouseController}
            />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

ReactDOM.render(<App samples={samples} />, document.getElementById("root"));
