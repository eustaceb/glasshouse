import * as Tone from "tone";
import {scale} from "../utils/Math.js";

export class FXControl {
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

    // Switch settings, @TODO: Abstract
    this.switchOptions = null;
    this.switchParamName = "";
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

  getSwitchParamName() {
    return this.switchParamName;
  }

  addSwitch(parameter, options) {
    // list of dictionaries which each has
    // - label
    // - value
    // - callback
    this.switchParamName = parameter;
    this.switchOptions = options.map((opt) => {
      return {
        label: opt.toString() + "x",
        value: opt,
        callback: (index) => {
          this.setParam(parameter, opt);
        },
      };
    });
  }

  hasSwitch() {
    return this.switchOptions !== null;
  }

  getSwitchLabels() {
    return this.switchOptions.map((opt) => opt.label);
  }

  getSwitchCallbacks() {
    return this.switchOptions.map((opt) => opt.callback);
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
      volume: Tone.Volume
    };
    return new fxLookup[type](params);
  }
}

class XYControl extends FXControl {
  constructor(type, label, params, xAxis, yAxis) {
    super(type, label, params);
    console.assert(
      xAxis.hasOwnProperty("paramName") && xAxis.hasOwnProperty("range")
    );
    console.assert(
      yAxis.hasOwnProperty("paramName") && yAxis.hasOwnProperty("range")
    );
    this.xAxis = xAxis;
    this.yAxis = yAxis;
  }
  setX(value) {
    const scaled = scale(
      value,
      0,
      1.0,
      this.xAxis.range[0],
      this.xAxis.range[1]
    );
    this.setParam(this.xAxis.paramName, scaled);
  }
  setY(value) {
    const scaled = scale(
      value,
      0,
      1.0,
      this.yAxis.range[0],
      this.yAxis.range[1]
    );
    this.setParam(this.yAxis.paramName, scaled);
  }
}

class WetControl extends FXControl {
  constructor(type, label, params) {
    super(type, label, params);
    this.setWet(0);
  }
  setWet(value) {
    this.node.wet.value = value;
  }
}

export {WetControl, XYControl};
