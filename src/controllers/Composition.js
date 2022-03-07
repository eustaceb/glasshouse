import {FxTrigger} from "./FXController.js";
import {SampleCell, FxCell} from "./Cells.js";

export class Composition {
  constructor(sampleController, fxController, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.frames = this.generateData(sampleController, fxController);
  }
  addFrame(frame) {
    const validateRow = (row) =>
      row.reduce((prev, current) => prev.cols + current.cols) == this.cols;
    console.assert(
      frame.every(
        (row) => validateRow(row),
        `Not enough cols in frame ${this.frames.length}`
      )
    );
    this.frames.append(frame);
  }
  getFrame(frameNumber) {
    console.assert(
      frameNumber < this.frames.length,
      `Requested frame ${frameNumber} which is less than current frames ${this.frames.length}`
    );
    return this.frames[frameNumber];
  }
  generateData(sampleController, fxController) {
    // List of frames
    return [
      this.generateFrame0(
        sampleController,
        fxController
      ) /*this.generateFrame1(sampleController, fxController)*/,
    ];
  }
  generateFrame0(sampleController, fxController) {
    // Looks up a sample in the controller
    const vocalsIntro = sampleController.getSampleByName("Vocals Intro");
    const volcaFirst = sampleController.getSampleByName("Volca FM first");
    const percFirst = sampleController.getSampleByName("Perc first");
    const shamHighPluck = sampleController.getSampleByName("Sham HighPluck");
    const bassIntro = sampleController.getSampleByName("Bass Intro");
    const chiralSynth = sampleController.getSampleByName("Chiral Synth");

    const row0 = [
      new SampleCell(vocalsIntro, 2, 3),
      new SampleCell(volcaFirst, 1, 2),
    ];
    const fxChorus = new FxTrigger({
      player: vocalsIntro.player,
      displayName: "Chorus",
      type: "chorus",
      color: "#8ca831",
      params: {frequency: 1.5, delayTime: 3.5, depth: 0.7},
    });
    const fxDelay = new FxTrigger({
      player: vocalsIntro.player,
      displayName: "Delay",
      type: "pingpong",
      color: "#A99d88",
      params: {delayTime: "1n", feedback: 0.2},
    });
    const row1 = [new FxCell(fxChorus, 1, 1), new FxCell(fxDelay, 1, 1)];
    const row2 = [new SampleCell(percFirst, 1, 5)];

    const fxDistortion = new FxTrigger({
      player: chiralSynth.player,
      displayName: "Distortion",
      type: "distortion",
      color: "#800f31",
      params: {amount: 0.1},
    });
    const fxChorusChiral = new FxTrigger({
      player: chiralSynth.player,
      displayName: "Chorus",
      type: "chorus",
      color: "#099db8",
      params: {frequency: 1.5, delayTime: 3.5, depth: 0.7},
    });
    const fxDelayChiral = new FxTrigger({
      player: chiralSynth.player,
      displayName: "Delay",
      type: "pingpong",
      color: "#6909b8",
      params: {delayTime: "4n", feedback: 0.4},
    });
    const row3 = [
      new FxCell(fxDistortion, 1, 1),
      new FxCell(fxChorusChiral, 1, 1),
      new FxCell(fxDelayChiral, 1, 1),
      new SampleCell(chiralSynth, 1, 2),
    ];
    const row4 = [
      new SampleCell(bassIntro, 1, 3),
      new SampleCell(shamHighPluck, 1, 2),
    ];
    return [row0, row1, row2, row3, row4];
  }
}
