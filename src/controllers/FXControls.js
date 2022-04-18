import * as Tone from "tone";

export class FXControl {
  constructor(type, label, params) {
    this.type = type;
    this.label = label;
    this.params = params;
    this.node = this.createFxNode(type, params);
    this.node.toDestination();
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
      this.node[parameter] instanceof Tone.Param
    ) {
      if (this.node[parameter].value !== value) {
        this.node[parameter].value = value;
      }
    } else if (this.node[parameter] !== value) {
      this.node[parameter] = value;
    }
  }

  createFxNode(type, params) {
    const fxLookup = {
      "bitcrusher": Tone.BitCrusher,
      "chorus": Tone.Chorus,
      "delay": Tone.FeedbackDelay,
      "distortion": Tone.Distortion,
      "filter": Tone.Filter,
      "pingpong": Tone.PingPongDelay,
      "reverb": Tone.Reverb,
      "vibrato": Tone.Vibrato
    };
    return new fxLookup[type](params);
  }
}

class XYControl extends FXControl {
  constructor(type, label, player, params, xAxis, yAxis) {
    super(type, label, player, params);
    console.assert(
      xAxis.hasOwnProperty("paramName") && xAxis.hasOwnProperty("range")
    );
    console.assert(
      yAxis.hasOwnProperty("paramName") && yAxis.hasOwnProperty("range")
    );
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.setY(0); // Currently this is always the Dry/Wet control
  }
  setX(value) {
    this.setParam(this.xAxis.paramName, value);
  }
  setY(value) {
    this.setParam(this.yAxis.paramName, value);
  }
  getXRange() {
    return this.xAxis.range;
  }
  getYRange() {
    return this.yAxis.range;
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
