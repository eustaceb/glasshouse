import * as Tone from "tone";
import { scale } from "../utils/Math.js";

export class FXControl {
  constructor(type, label, player, params) {
    this.type = type;
    this.label = label;
    this.player = player;
    this.params = params;
    this.node = this.createFxNode(type, params);
    this.player.chain(this.node, Tone.Destination);
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
      console.log(`${this.type} ${parameter} is now ${this.node[parameter].value}`);
    } else if (this.node[parameter] !== value) {
      this.node[parameter] = value;
    }
  }
  enable(enabled) {
    console.log(`${enabled ? "Enabling" : "Disabling"} ${this.type}`);
    if (enabled) this.player.connect(this.node);
    else this.player.disconnect(this.node);
  }
  createFxNode(type, params) {
    if (type == "distortion") {
      return new Tone.Distortion(params["amount"]);
    } else if (type == "reverb") {
      return new Tone.Reverb(params["decay"]);
    } else if (type == "pingpong") {
      return new Tone.PingPongDelay(
        params["delayTime"],
        params["feedback"]
      );
    } else if (type == "chorus") {
      return new Tone.Chorus(
        params["frequency"],
        params["delayTime"],
        params["depth"]
      );
    } else if (type == "vibrato") {
      return new Tone.Vibrato(
        params["frequency"],
        params["delayTime"],
        params["depth"]
      );
    } else if (type == "filter") {
      return new Tone.Filter(
        params["frequency"],
        params["type"],
        params["rolloff"]
      );
    }
    console.assert(false, `Unknown fx type: ${type}`);
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
    const scaled = scale(value, 0, 1.0, this.xAxis.range[0], this.xAxis.range[1]);
    this.setParam(this.xAxis.paramName, scaled);
  }
  setY(value) {
    const scaled = scale(value, 0, 1.0, this.yAxis.range[0], this.yAxis.range[1]);
    this.setParam(this.yAxis.paramName, scaled);
  }
}

class WetControl extends FXControl {
  constructor(type, label, player, params) {
    super(type, label, player, params);
    this.setWet(0);
  }
  setWet(value) {
    this.node.wet.value = value;
  }
}

export {WetControl, XYControl};
