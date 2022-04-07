import {WetControl, XYControl} from "./FXControls.js";

export class Section {
  /**
   * Represents a song section
   * @param {Array} bgSamples Background samples
   * @param {Array} fgSamples Foreground samples
   * @param {Array} effects List of FX in section
   */
  constructor(name, bgSamples, fgSamples, effects, xyEffects) {
    this.name = name;
    this.bgSamples = bgSamples;
    this.fgSamples = fgSamples;
    this.effects = effects;
    this.xyEffects = xyEffects;
  }
  getName() {
    return this.name;
  }
  getBgSamples() {
    return this.bgSamples;
  }
  getFgSamples() {
    return this.fgSamples;
  }
  getEffects() {
    return this.effects;
  }
  getXyEffects() {
    return this.xyEffects;
  }
}

export class Composition {
  constructor(sampleController, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.frameNames = [];
    this.backgroundSampleNames = [];
    this.sections = this.generateData(sampleController);
  }
  getSectionCount() {
    return this.sections.length;
  }
  getSection(index) {
    console.assert(
      index >= 0 && index < this.sections.length,
      `Requested section ${index} does not exist`
    );
    return this.sections[index];
  }
  generateData(sampleController) {
    const section0 = {
      name: "Intro",
      bgSamples: ["Bass Chorus"],
      fgSamples: ["Vocals Intro", "Chiral Synth", "Perc first", "Sham first"],
      effects: [
        {
          type: "distortion",
          sample: "Chiral Synth",
          params: {amount: 0.4},
        },
        {
          type: "pingpong",
          sample: "Vocals Intro",
          params: {delayTime: "4n", feedback: 0.8},
        },
      ],
      xyEffects: [
        {
          type: "vibrato",
          sample: "Perc first",
          params: {frequency: 2, depth: 0.5},
          xAxis: {paramName: "depth", range: [0, 1]},
          yAxis: {paramName: "wet", range: [0, 1]},
        }
      ]
    };
    const section1 = {
      name: "First Section",
      bgSamples: ["Bass LongerNote"],
      fgSamples: [
        "Vocals VerseOne",
        "Perc second",
        "Volca FM third",
        "Sham HighPluck",
      ],
      effects: [
        {
          type: "distortion",
          sample: "Volca FM third",
          params: {amount: 0.4},
        },
        {
          type: "pingpong",
          sample: "Vocals VerseOne",
          params: {delayTime: "4n", feedback: 0.4},
        },
      ],
      xyEffects: [
        {
          type: "distortion",
          sample: "Sham HighPluck",
          params: {amount: 0.5},
          xAxis: {paramName: "distortion", range: [0, 1]},
          yAxis: {paramName: "wet", range: [0, 1]},
        }
      ]
    };
    // {frequency: 6, delayTime: 1, depth: 0.9} chorus
    return [section0, section1].map((s) => {
      const bgSamples = s.bgSamples.map((name) =>
        sampleController.getSampleByName(name)
      );
      const fgSamples = s.fgSamples.map((name) =>
        sampleController.getSampleByName(name)
      );
      const effects = s.effects.map(
        (fx) =>
          new WetControl(
            fx.type,
            `${fx.type} for ${fx.sample}`,
            sampleController.getSampleByName(fx.sample).player,
            fx.params
          )
      );
      const xyEffects = s.xyEffects.map(
        (fx) =>
          new XYControl(
            fx.type,
            `${fx.type} for ${fx.sample}`,
            sampleController.getSampleByName(fx.sample).player,
            fx.params,
            fx.xAxis,
            fx.yAxis
          )
      );
      return new Section(s.name, bgSamples, fgSamples, effects, xyEffects);
    });
  }
}
