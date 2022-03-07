import {SampleCell, FxCell} from "./Cells.js";

export class Composition {
  constructor(sampleController, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.frames = this.generateData(sampleController);
  }
  addFrame(frame) {
    const validateRow = (row) => row.reduce((prev, current) => prev.cols + current.cols) == this.cols;
    console.assert(frame.every((row) => validateRow(row), `Not enough cols in frame ${this.frames.length}`));
    this.frames.append(frame);
  }
  getFrame(frameNumber) {
    console.assert(
      frameNumber < this.frames.length,
      `Requested frame ${frameNumber} which is less than current frames ${this.frames.length}`
    );
    return this.frames[frameNumber];
  }
  generateData(sampleController) {
    // List of frames
    return [
      this.generateFrame0(
        sampleController
      ) /*this.generateFrame1(sampleController)*/,
    ];
  }
  generateFrame0(sampleController) {
    // Looks up a sample in the controller
    const findSample = (sampleName) =>
      sampleController.getSampleByName(sampleName);
    const findFx = (fxName) =>
      sampleController.getSamples()[0].fx.getFxByName(fxName);
    const row0 = [
      new SampleCell(findSample("Vocals Intro"), 2, 3),
      new SampleCell(findSample("Volca FM first"), 1, 2),
    ];
    const row1 = [
      new FxCell(findFx("reverb"), 1, 1),
      new FxCell(findFx("pitchshift"), 1, 1),
    ];
    const row2 = [new SampleCell(findSample("Perc first"), 1, 5)];
    const row3 = [
      new FxCell(findFx("distortion"), 1, 1),
      new FxCell(findFx("chorus"), 1, 1),
      new FxCell(findFx("delay"), 1, 1),
      new SampleCell(findSample("Sham HighPluck"), 1, 2),
    ];
    const row4 = [
      new SampleCell(findSample("Bass Intro"), 1, 3),
      new SampleCell(findSample("Chiral Synth"), 1, 2),
    ];
    return [row0, row1, row2, row3, row4];
  }
}
