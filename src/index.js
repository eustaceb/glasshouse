import * as Tone from "tone";
import React, {useState} from "react";
import ReactDOM from "react-dom";
import {SamplePlayer} from "./components/SamplePlayer.js";
import Grid from "@material-ui/core/Grid";
import {synthTheme} from "./theme.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {MouseController} from "./controllers/MouseController.js";

const samples = [
  {
    name: "hihats",
    path: "audio/hihats.mp3",
    buffer: new Tone.Buffer("audio/hihats.mp3"),
  },
  {
    name: "synth",
    path: "audio/synth.mp3",
    buffer: new Tone.Buffer("audio/synth.mp3"),
  },
];

function App(props) {
  const [mouseController, setMouseController] = useState(
    new MouseController(window.document)
  );

  return (
    <ThemeProvider theme={synthTheme}>
      <Grid container justify="center" spacing={2}>
        <Grid item xs={6}>
          <Grid container justify="center" spacing={2}>
            <SamplePlayer
              samples={props.samples}
              mouseController={mouseController}
            />
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

ReactDOM.render(<App samples={samples} />, document.getElementById("root"));
