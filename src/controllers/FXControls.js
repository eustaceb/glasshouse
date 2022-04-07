import * as Tone from "tone";

export class FXControl {
  constructor(type, player, params) {
    this.type = type;
    this.player = player;
    this.params = params;
    this.node = this.createFxNode(type, params);
    // @TODO: defer this?
    this.player.connect(this.node);
  }

  setParam(parameter, value) {
    if (this.node[parameter] instanceof Tone.Signal || this.node[parameter] instanceof Tone.Param) {
      if (this.node[parameter].value !== value) {
        this.node[parameter].value = value;
      }
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
      return new Tone.Distortion(params["amount"]).toDestination();
    } else if (type == "reverb") {
      return new Tone.Reverb(params["decay"]).toDestination();
    } else if (type == "pingpong") {
      return new Tone.PingPongDelay(
        params["delayTime"],
        params["feedback"]
      ).toDestination();
    } else if (type == "chorus") {
      return new Tone.Chorus(
        params["frequency"],
        params["delayTime"],
        params["depth"]
      ).toDestination();
    } else if (type == "lowpass") {
      return new Tone.Filter(params["frequency"], "lowpass").toDestination();
    } else if (type == "vibrato") {
      return new Tone.Vibrato(
        params["frequency"],
        params["delayTime"],
        params["depth"]
      ).toDestination();
    }
    console.assert(false, `Unknown fx type: ${type}`);
  }
}

class XYControl extends FXControl {
  constructor(type, player, params, xAxis, yAxis) {
    super(type, player, params);
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
  constructor(type, player, params) {
    super(type, player, params);
    this.setWet(0);
  }
  setWet(value) {
    this.node.wet.value = value;
  }
}

export {WetControl, XYControl};
