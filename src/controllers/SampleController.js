import * as Tone from "tone";

class Sample {
  constructor(name, path, color) {
    this.name = name;
    this.path = path;
    this.buffer = new Tone.Buffer(path);
    this.player = new Tone.Player(this.buffer).toDestination();
    this.isLooping = false;
    this.color = color;
    this.distortionAmount = 0;
  }
  enableDistortion(enable) {
    // @TODO: Add disable functionality
    if (enable) {
      const distortion = new Tone.Distortion(this.distortionAmount).toDestination();
      this.player.connect(distortion); 
    }
  }
  setLoop(loop) {
    this.player.loop = loop;
  }
  play() {
    this.player.start();
  }
  stop() {
    this.player.stop();
  }
}

export class SampleController {
  constructor() {
    // @TODO: Load from JSON
    this.samples = [
      {
        name: "hihats",
        path: "audio/hihats.mp3",
        color: "#800080",
      },
      {
        name: "synth",
        path: "audio/synth.mp3",
        color: "#800020",
      },
    ].map(sample => new Sample(sample.name, sample.path, sample.color));

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
