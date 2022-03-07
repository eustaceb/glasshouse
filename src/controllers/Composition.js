import {FxTrigger} from "./FXController.js";
import {SampleCell, FxCell} from "./Cells.js";

export class Composition {
  constructor(sampleController, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.frameNames = [];
    this.frames = this.generateData(sampleController);
  }
  getFrameCount() {
    return this.frames.length;
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
  getFrameName(frameNumber) {
    console.assert(
      frameNumber < this.frames.length,
      `Requested frame ${frameNumber} which is less than current frames ${this.frames.length}`
    );
    return this.frameNames[frameNumber];
  }
  generateData(sampleController) {
    this.frameNames = ["Intro", "First Section"];
    return [
      this.generateFrame0(sampleController),
      this.generateFrame1(sampleController),
    ];
  }

  generateFrame0(sampleController) {
    const row0 = [
      {
        type: "sample",
        name: "Vocals Intro",
        displayName: "Vocals (intro)",
        rows: 2,
        cols: 3,
      },
      {
        type: "sample",
        name: "Perc first",
        displayName: "Perc (first)",
        rows: 1,
        cols: 2,
      },
    ];
    const row1 = [
      {
        type: "fx",
        fx: "chorus",
        forSample: "Vocals Intro",
        displayName: "Chorus",
        color: "#8ca831",
        params: {frequency: 1.5, delayTime: 3.5, depth: 0.7},
        rows: 1,
        cols: 1,
      },
      {
        type: "fx",
        fx: "pingpong",
        forSample: "Vocals Intro",
        displayName: "Delay",
        color: "#A99d88",
        params: {delayTime: "1n", feedback: 0.6},
        rows: 1,
        cols: 1,
      },
    ];
    const row2 = [
      {
        type: "sample",
        name: "Perc second",
        displayName: "Perc (second)",
        rows: 1,
        cols: 5,
      },
    ];
    const row3 = [
      {
        type: "fx",
        fx: "distortion",
        forSample: "Chiral Synth",
        displayName: "Vocals Intro",
        color: "#800f31",
        params: {amount: 0.1},
        rows: 1,
        cols: 1,
      },
      {
        type: "fx",
        fx: "chorus",
        forSample: "Chiral Synth",
        displayName: "Chorus",
        color: "#099db8",
        params: {amount: 0.1},
        rows: 1,
        cols: 1,
      },
      {
        type: "fx",
        fx: "pingpong",
        forSample: "Chiral Synth",
        displayName: "Delay",
        color: "#6909b8",
        params: {delayTime: "4n", feedback: 0.4},
        rows: 1,
        cols: 1,
      },
      {
        type: "sample",
        name: "Chiral Synth",
        displayName: "Chiral synth",
        rows: 1,
        cols: 2,
      },
    ];
    const row4 = [
      {
        type: "sample",
        name: "Bass Intro",
        displayName: "Bass (intro)",
        rows: 1,
        cols: 3,
      },
      {
        type: "sample",
        name: "Sham HighPluck",
        displayName: "Chiral synth",
        rows: 1,
        cols: 2,
      },
    ];
    const frameData = [row0, row1, row2, row3, row4];
    return this.generateFrame(frameData, sampleController);
  }
  generateFrame1(sampleController) {
    const row0 = [
      {
        type: "sample",
        name: "Bass Melodic",
        displayName: "Bass Melodic",
        rows: 1,
        cols: 4,
      },
      {
        type: "fx",
        fx: "pingpong",
        forSample: "Bass Melodic",
        displayName: "Delay",
        color: "#6909b8",
        params: {delayTime: "4n", feedback: 0.4},
        rows: 1,
        cols: 1,
      },
    ];
    const row1 = [
      {
        type: "fx",
        fx: "pingpong",
        forSample: "Vocals VerseOne",
        displayName: "Delay",
        color: "#6909b8",
        params: {delayTime: "1n", feedback: 0.6},
        rows: 1,
        cols: 1,
      },
      {
        type: "sample",
        name: "Vocals VerseOne",
        displayName: "Vocals (verse 1)",
        rows: 1,
        cols: 3,
      },
      {
        type: "fx",
        fx: "chorus",
        forSample: "Vocals VerseOne",
        displayName: "Chorus",
        color: "#6909b8",
        params: {frequency: 6, delayTime: 1, depth: 0.9},
        rows: 1,
        cols: 1,
      },
    ];
    const row2 = [
      {
        type: "sample",
        name: "Sham first",
        displayName: "Sham (first)",
        rows: 1,
        cols: 2,
      },
      {
        type: "sample",
        name: "Volca FM first",
        displayName: "Volca FM (first)",
        rows: 1,
        cols: 2,
      },
      {
        type: "fx",
        fx: "chorus",
        forSample: "Sham first",
        displayName: "Chorus",
        color: "#6909b8",
        params: {frequency: 6, delayTime: 1, depth: 0.9},
        rows: 1,
        cols: 1,
      },
    ];
    const row3 = [
      {
        type: "sample",
        name: "Perc first",
        displayName: "Perc (first)",
        rows: 1,
        cols: 2,
      },
      {
        type: "sample",
        name: "Perc second",
        displayName: "Perc (second)",
        rows: 1,
        cols: 3,
      },
    ];
    const row4 = [
      {
        type: "sample",
        name: "Bass LongerNote",
        displayName: "Bass (longer note)",
        rows: 1,
        cols: 3,
      },
      {
        type: "sample",
        name: "Vocals VerseTwo",
        displayName: "Vocals (verse 2)",
        rows: 1,
        cols: 2,
      },
    ];
    const frameData = [row0, row1, row2, row3, row4];
    return this.generateFrame(frameData, sampleController);
  }
  generateFrame(frameData, sampleController) {
    const createCell = (data) => {
      if (data.type === "sample") {
        return new SampleCell(
          sampleController.getSampleByName(data.name),
          data.rows,
          data.cols
        );
      } else if (data.type === "fx") {
        const fx = new FxTrigger({
          player: sampleController.getSampleByName(data.forSample).player,
          displayName: data.displayName,
          type: data.fx,
          color: data.color,
          params: data.params,
        });
        return new FxCell(fx, data.rows, data.cols);
      }
    };
    return frameData.map((row) => row.map(createCell));
  }
}
