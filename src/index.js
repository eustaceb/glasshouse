import * as Tone from "tone";
import React, {useRef, useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {SamplePlayer} from "./components/SamplePlayer.js";
import Grid from "@material-ui/core/Grid";
import {synthTheme} from "./theme.js";
import {ThemeProvider} from "@material-ui/core/styles";
import {MouseController} from "./controllers/MouseController.js";
import {SampleController} from "./controllers/SampleController.js";
import "./style.css";

const mouseController = new MouseController(window.document);

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

function App(props) {
  const mouseController = useRef(props.mouseController);
  const sampler = useRef(new SampleController());

  useEffect(() => {
    Tone.Transport.scheduleRepeat((time) => {
      // Update visuals
      if (sampler.current.beat % 8 == 0) {
        Tone.Draw.schedule(function () {
          const pads = document.querySelectorAll(".beatStrip");
          const increments = [0, 33, 66, 100];

          pads.forEach(function (el) {
            el.style.width =
              increments[Math.round(sampler.current.beat / 8)].toString() + "%";
          });
        }, time);
      }

      // Preschedule 1/32nd early
      if (sampler.current.beat == 31) {
        sampler.current.getSamples().forEach(function (sample) {
          if (sample.isPlaying) {
            // If we're not looping and played the simple once already, stop playback
            if (!sample.isLooping && sample.donePlaying) {
              sample.isPlaying = false;

              // Rerender UI
              sample.endPlaybackCallback();
            } else {
              sample.play("+32n");
            }
          }
        });
      }

      if (sampler.current.beat == 0) {
        sampler.current.barPassed();
      }
      sampler.current.beat = (sampler.current.beat + 1) % 32;
    }, "32n");

    return () => {
      console.log("Unloading App");
      Tone.Transport.stop();
    };
  });

  return (
    <ThemeProvider theme={synthTheme}>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        {/* <Grid item xs={12}>
          <PlaybackControls
            start={() => Tone.Transport.start()}
            stop={() => Tone.Transport.stop()}
          />
        </Grid> */}
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
