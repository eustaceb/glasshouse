import * as Tone from "tone";

class FxParam {
  /**
   * Class that represents an FX parameter
   * @param {*} name Name of the effect
   * @param {*} displayName Name to be displayed on the UI
   * @param {*} type At the moment there are three types: "range", "toggle"
   * @param {*} initialValue Starting value
   * @param {*} values A range [min, max] if type is "range", set of permitted values otherwise
   */
  constructor(name, displayName, type, values, initialValue) {
    this.name = name;
    this.displayName = displayName;
    this.type = type;
    if (type === "range") {
      [this.min, this.max] = values;
    } else {
      this.values = values;
    }
    this.value = initialValue;
  }

  setValue(value) {
    this.value = value;
  }
}

class Fx {
  constructor(name, displayName, params) {
    this.name = name;
    this.displayName = displayName;
    this.params = params;
    this.params["enabled"] = new FxParam(
      "enabled",
      "Enabled",
      "toggle",
      [true, false],
      false
    );
    this.node = null;
  }
  isEnabled() {
    return this.params["enabled"]["value"];
  }
  setNode(node) {
    this.node = node;
  }
}

export class FXController {
  constructor(player) {
    this.player = player;

    this.createFxCallbacks = {
      distortion: this.createDistortionFx,
      reverb: this.createReverbFx,
      delay: this.createDelayFx,
      chorus: this.createChorusFx,
    };

    this.effects = {};
    this.effects["distortion"] = new Fx("distortion", "Distortion", {
      amount: new FxParam("amount", "Amount", "range", [0, 1], 0),
    });
    this.effects["reverb"] = new Fx("reverb", "Reverb", {
      decay: new FxParam("decay", "Decay (s)", "range", [0.001, 10], 0.001),
    });
    this.effects["delay"] = new Fx("delay", "Delay", {
      delayTime: new FxParam(
        "delayTime",
        "Delay Time (ms)",
        "range",
        [0, 1000],
        0
      ),
      feedback: new FxParam("feedback", "Feedback", "range", [0, 1], 0),
    });
    this.effects["chorus"] = new Fx("chorus", "Chorus", {
      frequency: new FxParam(
        "frequency",
        "Frequency",
        "range",
        [0.0, 10.0],
        0
      ),
      delayTime: new FxParam(
        "delayTime",
        "Delay Time (ms)",
        "range",
        [0, 20],
        0
      ),
      depth: new FxParam("depth", "Depth", "range", [0.0, 10.0], 0),
    });
  }

  setFxParam(fxName, parameter, value) {
    console.log("Setting " + fxName + " param " + parameter + " value " + value.toString());
    const fx = this.effects[fxName];
    const prevEnabled = fx.isEnabled();

    if (fx.params[parameter].value !== value) {
      fx.params[parameter].value = value;

      // First, disconnect the effect so that we can modify parameters
      if (prevEnabled) {
        this.player.disconnect(fx.node);
      }

      // Then reconnect with new params if enabled
      if (fx.isEnabled()) {
        fx.node = this.createFxCallbacks[fxName](fx.params);
        this.player.connect(fx.node);
      }
    }

  }

  createDistortionFx(params) {
    return new Tone.Distortion(params["amount"]["value"]).toDestination();
  }

  createReverbFx(params) {
    console.log("Creating reverb with " + params.toString());
    return new Tone.Reverb(params["decay"]["value"]).toDestination();
  }

  createDelayFx(params) {
    return new Tone.PingPongDelay(
      params["delayTime"]["value"],
      params["feedback"]["value"]
    ).toDestination();
  }

  createChorusFx(params) {
    return new Tone.Chorus(
      params["frequency"]["value"],
      params["delayTime"]["value"],
      params["depth"]["value"]
    ).toDestination();
  }
}
