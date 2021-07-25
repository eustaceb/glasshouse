import * as Tone from "tone";
import React, {useRef, useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {SamplePlayer} from "./components/SamplePlayer.js";
import Grid from "@material-ui/core/Grid";
import {synthTheme} from "./theme.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {MouseController} from "./controllers/MouseController.js";
import {SampleController} from "./controllers/SampleController.js";
import {PlaybackControls} from "./components/PlaybackControls.js";
import "./style.css";

const mouseController = new MouseController(window.document);
let beat = 0;

function App(props) {
  const mouseController = useRef(props.mouseController);
  const sampler = useRef(new SampleController());

  useEffect(() => {
    // TODO: On startup, preschedule the first loop and then start the transport
    Tone.Transport.start();

    Tone.Transport.scheduleRepeat((time) => {
      // Update visuals
      if (beat % 8 == 0) {
        Tone.Draw.schedule(function () {
          const pads = document.querySelectorAll(".beatStrip");
          const increments = [0, 33, 66, 100];
  
          pads.forEach(function (el) {
            el.style.width = increments[Math.round(beat / 8)].toString() + "%";
          });
        }, time);
      }

      // Preschedule 1/32nd early
      if (beat == 31) {
        console.log("Current time " + time);
        sampler.current.getSamples().forEach(function (sample) {
          if (sample.update) {
            if (sample.isPlaying) {
              sample.play("+32n");
            } else {
              sample.stop("+32n");
            }
            sample.update = false;
          }
        });
      }

      beat = (beat + 1) % 32;
    }, "32n");

    return () => {
      Tone.Transport.stop();
    };
  });

  return (
    <ThemeProvider theme={synthTheme}>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <PlaybackControls
            start={() => Tone.Transport.start()}
            stop={() => Tone.Transport.stop()}
          />
        </Grid>
        <Grid item xs={6}>
          <SamplePlayer
            sampler={sampler.current}
            mouseController={mouseController}
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
