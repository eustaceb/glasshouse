import React from "react";
import ReactDOM from "react-dom";
import Grid from "@material-ui/core/Grid";
import {synthTheme} from "./theme.js";
import {ThemeProvider} from "@material-ui/core/styles";
import "./style.css";
import * as Tone from "tone";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

class BasicSample {
    static idCounter = 0;
    constructor(id, name, path, color, type, duration) {
      this.id = id; // string type
      this.name = name;
      this.path = path;
      this.buffer = new Tone.Buffer(path);
      this.type = type;
      this.player = new Tone.Player(this.buffer, () => {
        console.log("Loaded " + this.name);
      });
      this.player.toDestination().sync();
      this.color = color;
      this.duration = duration;
    }
    play(time) {
      console.log(`Playing ${this.name} at ${typeof time === 'string' ? time : time.toBarsBeatsSixteenths()}`);
      this.player.start(time);
    }
  }
  
  class BasicPlaybackController {
    constructor(sampleController) {
      this.started = false;
      this.sampleController = sampleController;
    }
    start(time) {
      if (!this.started) {
        console.log(`Starting playback at ${time}`);
        Tone.Transport.start(time);
        Tone.Transport.scheduleRepeat((t) => this.tick(t), "16n");
        this.started = true;
      }
    }
    tick(time) {
      const timestamp = Tone.Time(time).toBarsBeatsSixteenths().split(".")[0];
      const [bar, beat, sixteenth] = timestamp.split(":");
      console.log(`${bar} ${beat} ${sixteenth}`);
      if (beat === "3" && sixteenth === "3") {
        this.sampleController.tick();
      }
    }
  }
  
  class BasicSampleController {
    constructor() {
      this.samples = [
        {
          name: "Click 1",
          path: "audio/click1.mp3",
          color: "#1FF45B",
          type: "loop",
          duration: -1,
        },
        {
          name: "Click 2",
          path: "audio/click2.mp3",
          color: "#6980E7",
          type: "oneshot",
          duration: 1,
        },
      ].map(
        (sample) =>
          new BasicSample(
            (BasicSample.idCounter++).toString(),
            sample.name,
            sample.path,
            sample.color,
            sample.type,
            sample.duration
          )
      );
      this.playing = new Array(this.samples.length).fill(false);
    }
    play(sampleIndex) {
      this.playing[sampleIndex] = this.samples[sampleIndex].duration;
    }
    tick() {
      for (var i = 0; i < this.samples.length; i++) {
        if (this.playing[i] != 0) {
          this.samples[i].play("+16n");
        }
        if (this.playing[i] > 0) {
          this.playing[i] = this.playing[i] - 1;
        }
      }
    }
  }
  
  function BasicSamplePlayer(props) {
    const sampleController = new BasicSampleController();
    const playback = new BasicPlaybackController(sampleController);
  
    const playSample = (sampleIndex) => {
      if (!playback.started) {
        playback.start(0.1);
      }
      sampleController.play(sampleIndex);
    };
  
    const playButtons = sampleController.samples.map((sample, index) => {
      return (
        <Grid item xs={6} xl={2} key={index}>
          <button onClick={() => playSample(index)}>Play {sample.name}</button>
            {/* playSample={() => playSample(index)}
            stopSample={() => stopSample(index)} */}
        </Grid>
      );
    });
    return (
      <Grid container spacing={2}>
        {playButtons}
      </Grid>
    );
  }
  
  function DebugApp(props) {
    return (
      <ThemeProvider theme={synthTheme}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <BasicSamplePlayer />
        </Grid>
      </ThemeProvider>
    );
  }
  
  ReactDOM.render(<DebugApp />, document.getElementById("basicSamplePlayer"));
  