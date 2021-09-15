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
    //   Tone.Transport.scheduleRepeat((time) => {
    //     const beat = playback.current.beat;
    //     console.log(beat);
    //     // Update visuals
    //     if (beat % 8 == 0) {
    //       Tone.Draw.schedule(function () {
    //         const pads = document.querySelectorAll(".beatStrip");
    //         const increments = [0, 33, 66, 100];
    //         pads.forEach(function (el) {
    //           el.style.width =
    //             increments[Math.round(beat / 8)].toString() + "%";
    //         });
    //       }, time);
    //     }
    //     // Preschedule 1/32nd early
    //     if (beat == 31) {
    //       sampler.current.getSamples().forEach(function (sample) {
    //         if (sample.isPlaying) {
    //           // If we're not looping and played the simple once already, stop playback
    //           if (!sample.isLooping && sample.donePlaying) {
    //             sample.isPlaying = false;
    //             // Rerender UI
    //             sample.endPlaybackCallback();
    //           } else {
    //             sample.play("+32n");
    //           }
    //         }
    //       });
    //     }
    //     if (beat == 0) {
    //       // Each bar we update sample state
    //       sampler.current.updateSamples();
    //       if (sampler.current.samplesPlaying == 0) {
    //         playback.current.stop();
    //       }
    //     }
    //     playback.current.beat = (beat + 1) % 32;
    //   }, "32n");
    // return () => {
    //   console.log("Unloading App");
    //   Tone.Transport.stop();
    // };
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
