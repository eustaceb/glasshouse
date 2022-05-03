import * as Tone from "tone";
import {scale} from "../utils/Math.js";

class FXControl {
  constructor(type, label, params) {
    this.type = type;
    this.label = label;
    this.params = params;
    this.node = this.createFxNode(type, params);

    // Callback that will be called when any param changes
    // the change will be forwarded somewhere else
    this.sidechain = null;
  }

  start() {
    if (["chorus", "autopanner"].includes(this.type)) {
      this.node.start();
    }
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
    } else if (this.node[parameter] !== value) {
      this.node[parameter] = value;
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
      phaser: Tone.Phaser,
      panner: Tone.Panner,
      panner3d: Tone.Panner3D,
      pitchshift: Tone.PitchShift,
      volume: Tone.Volume,
    };
    return new fxLookup[type](params);
  }
}

class XYControl {
  constructor(xFx, yFx, xAxis, yAxis) {
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
    this.xFx = xFx;
    this.yFx = yFx;
    this.xAxis = xAxis;
    this.yAxis = yAxis;

    // If a param is meant to be inverted, mark it as such
    this.invertedX = false;
    this.invertedY = false;
    if (xAxis.range[0] > xAxis.range[1]) {
      this.invertedX = true;
      [xAxis.range[0], xAxis.range[1]] = [xAxis.range[1], xAxis.range[0]];
    }
    if (yAxis.range[0] > yAxis.range[1]) {
      this.invertedY = true;
      [yAxis.range[0], yAxis.range[1]] = [yAxis.range[1], yAxis.range[0]];
    }
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
    // Invert value if X param is inverted
    if (this.invertedX) value = 1.0 - value;

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
    // Invert value if Y param is inverted
    if (this.invertedY) value = 1.0 - value;

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
