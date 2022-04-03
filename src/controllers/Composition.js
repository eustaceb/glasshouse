import {FxTrigger} from "./FXController.js";

export class Section {
  /**
   * Represents a song section
   * @param {Array} bgSamples Background samples
   * @param {Array} fgSamples Foreground samples
   * @param {Array} effects List of FX in section
   */
  constructor(name, bgSamples, fgSamples, effects) {
    this.name = name;
    this.bgSamples = bgSamples;
    this.fgSamples = fgSamples;
    this.effects = effects;
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
          params: {delayTime: "4n", feedback: 0.4},
        },
      ],
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
          new FxTrigger(
            fx.type,
            sampleController.getSampleByName(fx.sample).player,
            fx.params
          )
      );
      return new Section(s.name, bgSamples, fgSamples, effects);
    });
  }
}
