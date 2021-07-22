import * as Tone from "tone";

class Sample {
  constructor(name, path, color) {
    this.name = name;
    this.path = path;
    this.buffer = new Tone.Buffer(path);
    this.player = new Tone.Player(this.buffer).toDestination().sync();
    this.isLooping = true;
    this.isPlaying = false;
    this.color = color;
    this.distortionAmount = 0;
  }
  enableDistortion(enable) {
    // @TODO: Add disable functionality
    if (enable) {
      const distortion = new Tone.Distortion(
        this.distortionAmount
      ).toDestination();
      this.player.connect(distortion);
    }
  }
  setDistortionAmount(amount) {
    this.distortionAmount = amount;
  }
  setLoop(loop) {
    this.player.loop = loop;
    this.isLooping = loop;
  }
  play() {
    this.isPlaying = true;
    this.player = new Tone.Player(this.buffer).toDestination().sync();
    this.player.loop = this.isLooping;
    Tone.loaded().then(() => this.player.start(0));
  }
  stop() {
    this.isPlaying = false;
    this.player.stop();
  }
}

export class SampleController {
  constructor() {
    // @TODO: Load from JSON
    this.samples = [
      {
        name: "Kick",
        path: "audio/Kick.mp3",
        color: "#001F54",
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

    this.activeSample = 0;
  }
  setActiveSample(sampleIndex) {
    this.activeSample = sampleIndex;
    if (this.activeSampleCallback) this.activeSampleCallback(sampleIndex);
  }
  getActiveSample() {
    return this.activeSample;
  }
  getSample(sampleIndex) {
    return this.samples[sampleIndex];
  }
  getSamples() {
    return this.samples;
  }
  setActiveSampleCallback(callback) {
    this.activeSampleCallback = callback;
  }
  playSample(sampleIndex) {
    this.samples[sampleIndex].play();
  }
}
