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
    }

    if (this.sidechain !== null) {
      this.sidechain(parameter, value);
    }
  }

  registerSideChain(callback) {
    this.sidechain = callback;
  }

  getParam(parameter) {
    return this.node[parameter].value;
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
  constructor(fx, xAxis, yAxis) {
    this.fx = fx;
    console.assert(
      xAxis.hasOwnProperty("paramName") && xAxis.hasOwnProperty("range")
    );
    console.assert(
      yAxis.hasOwnProperty("paramName") && yAxis.hasOwnProperty("range")
    );
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }

  getLabel() {
    return this.fx.getLabel();
  }

  getLabelX() {
    return this.xAxis["paramName"];
  }

  getLabelY() {
    return this.yAxis["paramName"];
  }

  setX(value) {
    const scaled = scale(
      value,
      0,
      1.0,
      this.xAxis.range[0],
      this.xAxis.range[1]
    );
    this.fx.setParam(this.xAxis.paramName, scaled);
  }

  setY(value) {
    const scaled = scale(
      value,
      0,
      1.0,
      this.yAxis.range[0],
      this.yAxis.range[1]
    );
    this.fx.setParam(this.yAxis.paramName, scaled);
  }
}

class DiscreteControl {
  constructor(fx, paramName, values) {
    this.fx = fx;
    this.paramName = paramName;
    this.values = values;
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
    console.assert(
      this.values.includes(value),
      "Illegal value supplied to DiscreteControl"
    );
    this.fx.setParam(this.paramName, value);
  }

  setValueByIndex(index) {
    console.assert(
      index < this.values.length,
      "Discrete value index is out of bounds"
    );
    this.fx.setParam(this.paramName, this.values[index]);
  }
}

class WetControl {
  constructor(fx) {
    this.fx = fx;
  }

  getLabel() {
    return `Wet for ${this.fx.getLabel()}`;
  }

  getFx() {
    return this.fx;
  }

  setWet(value) {
    this.fx.setParam("wet", value);
  }
}

export {DiscreteControl, FXControl, WetControl, XYControl};
