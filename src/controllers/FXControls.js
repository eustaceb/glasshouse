import * as Tone from "tone";
import {scale} from "../utils/Math.js";

class FXControl {
  constructor(type, label, params) {
    this.type = type;
    this.label = label;
    this.params = params;
    this.node = this.createFxNode(type, params);
    if (["chorus", "autopanner"].includes(type)) {
      console.log(`Starting LFO for ${type}`);
      this.node.start();
    }

    // Callback that will be called when any param changes
    // the change will be forwarded somewhere else
    this.sidechain = null;
  }

  getNode() {
    return this.node;
  }

  getLabel() {
    return this.label;
  }

  setParam(parameter, value) {
    if (
      this.node[parameter] instanceof Tone.Signal ||
      this.node[parameter] instanceof Tone.Frequency ||
      this.node[parameter] instanceof Tone.Param
    ) {
      if (this.node[parameter].value !== value) {
        this.node[parameter].value = value;
      }
      console.log(
        `${this.type} ${parameter} is now ${this.node[parameter].value}`
      );
    } else if (this.node[parameter] !== value) {
      this.node[parameter] = value;
      console.log(
        `${this.type} ${parameter} is now ${this.node[parameter]}`
      );
    }

    if (this.sidechain !== null) {
      this.sidechain(parameter, value);
    }
  }

  getParam(parameter) {
    if (
      this.node[parameter] instanceof Tone.Signal ||
      this.node[parameter] instanceof Tone.Frequency ||
      this.node[parameter] instanceof Tone.Param
    ) {
      return this.node[parameter].value;
    } else {
      return this.node[parameter];
    }
  }

  registerSideChain(callback) {
    this.sidechain = callback;
  }

  createFxNode(type, params) {
    const fxLookup = {
      bitcrusher: Tone.BitCrusher,
      chorus: Tone.Chorus,
      delay: Tone.FeedbackDelay,
      distortion: Tone.Distortion,
      filter: Tone.Filter,
      pingpong: Tone.PingPongDelay,
      reverb: Tone.Reverb,
      vibrato: Tone.Vibrato,
      autopanner: Tone.AutoPanner,
      pitchshift: Tone.PitchShift,
      volume: Tone.Volume,
    };
    return new fxLookup[type](params);
  }
}

class XYControl {
  constructor(preFx, fx, xAxis, yAxis) {
    console.assert(
      xAxis.hasOwnProperty("paramName") &&
        xAxis.hasOwnProperty("range") &&
        xAxis.hasOwnProperty("source")
    );
    console.assert(
      yAxis.hasOwnProperty("paramName") &&
        yAxis.hasOwnProperty("range") &&
        yAxis.hasOwnProperty("source")
    );
    this.xFx = xAxis.source === "fx" ? fx : preFx;
    this.yFx = yAxis.source === "fx" ? fx : preFx;
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }

  getLabel() {
    return `${this.xFx.getLabel()} ${this.getLabelX()} and ${this.yFx.getLabel()} ${this.getLabelY()}`;
  }

  getLabelX() {
    return this.xAxis["paramName"];
  }

  getLabelY() {
    return this.yAxis["paramName"];
  }

  setX(value) {
    // Scales from [0, 1]
    const scaled = scale(
      value,
      0,
      1.0,
      this.xAxis.range[0],
      this.xAxis.range[1]
    );
    this.xFx.setParam(this.xAxis.paramName, scaled);
  }

  getX() {
    // Scales to [0, 1]
    return scale(
      this.xFx.getParam(this.xAxis.paramName),
      this.xAxis.range[0],
      this.xAxis.range[1],
      0,
      1.0
    );
  }

  setY(value) {
    // Scales from [0, 1]
    const scaled = scale(
      value,
      0,
      1.0,
      this.yAxis.range[0],
      this.yAxis.range[1]
    );
    this.yFx.setParam(this.yAxis.paramName, scaled);
  }

  getX() {
    // Scales to [0, 1]
    return scale(
      this.yFx.getParam(this.yAxis.paramName),
      this.yAxis.range[0],
      this.yAxis.range[1],
      0,
      1.0
    );
  }
}

class DiscreteControl {
  constructor(fx, paramName, values) {
    this.fx = fx;
    this.paramName = paramName;
    this.values = values;
    this.step = this.values.indexOf(this.getValue());
  }

  getLabel() {
    return `${this.paramName} for ${this.fx.getLabel()}`;
  }

  getParamName() {
    return this.paramName;
  }

  getValues() {
    return this.values;
  }

  setValue(value) {
    if (value !== this.getValue()) {
      this.fx.setParam(this.paramName, value);
    }
  }

  getValue() {
    return this.fx.getParam(this.paramName);
  }

  setStep(step) {
    this.setValue(this.values[step]);
  }

  getStep() {
    return this.step;
  }

  isContinuous() {
    return false;
  }
}

class ContinuousControl {
  constructor(fx, paramName, range) {
    this.fx = fx;
    this.paramName = paramName;
    this.range = range;
  }

  getLabel() {
    return `${this.paramName} for ${this.fx.getLabel()}`;
  }

  getFx() {
    return this.fx;
  }

  setValue(value) {
    this.fx.setParam(this.paramName, value);
  }

  getValue() {
    return this.fx.getParam(this.paramName);
  }

  isContinuous() {
    return true;
  }
}

export {DiscreteControl, FXControl, ContinuousControl, XYControl};
