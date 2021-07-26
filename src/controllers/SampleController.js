import * as Tone from "tone";
import {FXController} from "./FXController";

class Sample {
  constructor(name, path, color) {
    this.name = name;
    this.path = path;
    this.buffer = new Tone.Buffer(path);
    this.player = new Tone.Player(this.buffer, () => {
      console.log("Loaded " + this.name);
    });
    this.player.toDestination().sync();
    this.isLooping = true;
    this.isPlaying = false;
    this.color = color;
    this.endPlaybackCallback = null;
    this.donePlaying = false;
    this.fx = new FXController(this.player);
  }
  setLoop(loop) {
    this.isLooping = loop;
  }
  trigger() {
    this.isPlaying = !this.isPlaying;
    if (!this.isLooping) this.donePlaying = false;
  }
  play(time) {
    this.player.start(time);
  }
  stop(time) {
    this.player.stop(time);
  }
  setEndPlaybackCallback(callback) {
    this.endPlaybackCallback = callback;
  }
}

export class SampleController {
  constructor() {
    // @TODO: Load from JSON
    this.samples = [
      {
        name: "Kick",
        path: "audio/Kick.mp3",
        color: "#006FCA",
      },
      {
        name: "Snare",
        path: "audio/Snare.mp3",
        color: "#FF8C42",
      },
      {
        name: "Clap",
        path: "audio/Clap.mp3",
        color: "#A0A551",
      },
      {
        name: "Toms",
        path: "audio/Toms.mp3",
        color: "#427AA1",
      },
      {
        name: "Synth #1",
        path: "audio/Synth-1.mp3",
        color: "#820263",
      },
      {
        name: "Synth #2",
        path: "audio/Synth-2.mp3",
        color: "#8000A0",
      },
    ].map((sample) => new Sample(sample.name, sample.path, sample.color));
  }
  getSamples() {
    return this.samples;
  }
  playSample(sampleIndex) {
    this.samples[sampleIndex].play();
  }
}
