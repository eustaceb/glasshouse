import * as Tone from "tone";

export class SampleController {
  constructor() {
    this.samples = [
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
};
