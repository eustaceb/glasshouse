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
  constructor(name, displayName, type, values, initialValue, readonly = false) {
    this.name = name;
    this.displayName = displayName;
    this.type = type;
    if (type === "range") {
      [this.min, this.max] = values;
    } else {
      this.values = values;
    }
    this.value = initialValue;
    this.readonly = readonly;
  }
}

class Fx {
  constructor(name, params, fnEnabledCheck) {
    this.name = name;
    this.params = params;
    this.fnEnabledCheck = fnEnabledCheck;
    this.node = null;
  }
  isEnabled() {
    return this.fnEnabledCheck(this.params);
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

    // Some commonly used parameters
    const createAmountParam = () =>
      new FxParam("amount", "Amount", "range", [0, 100], 0);
    const createEnabledParam = () =>
      new FxParam("enabled", "Enabled", "toggle", [true, false], false);

    this.effects = {};
    this.effects["distortion"] = new Fx(
      "distortion",
      {amount: createAmountParam(), enabled: createEnabledParam()},
      (params) =>
        params["enabled"]["value"] === true && params["amount"]["value"] > 0
    );
    this.effects["reverb"] = new Fx(
      "reverb",
      {amount: createAmountParam(), enabled: createEnabledParam()},
      (params) =>
        params["enabled"]["value"] === true && params["amount"]["value"] > 0
    );
    this.effects["delay"] = new Fx(
      "delay",
      {amount: createAmountParam(), enabled: createEnabledParam()},
      (params) =>
        params["enabled"]["value"] === true && params["amount"]["value"] > 0
    );
    this.effects["chorus"] = new Fx(
      "chorus",
      {
        frequency: new FxParam("frequency", "Frequency", "range", [0, 10], 0, true),
        delayTime: new FxParam("delayTime", "Delay Time", "range", [0, 100], 0),
        depth: new FxParam("depth", "Depth", "range", [0, 1], 0),
        enabled: createEnabledParam(),
      },
      (params) => params["enabled"]["value"]
    );
  }

  setFxParam(fxName, parameter, value) {
    const fx = this.effects[fxName];
    const prevEnabled = fx.isEnabled();

    fx.params[parameter]["value"] = value;
    const enabled = fx.isEnabled();

    // Need to reinstate the node if a param is readonly
    let reconnect = false;
    if (fx.params[parameter].readonly) {
      reconnect = true;
    }

    // If we're disabling an effect, simply disconnect it and update state
    if (fx.isEnabled()) {
      // Modified a readonly property - need to reocnnect
      if (reconnect) {
        console.log(`Reconnecting effect ${fxName}`);
        this.player.disconnect(fx.node);
      }

      // Effect was disabled previously but is being enabled
      if (prevEnabled !== enabled || reconnect) {
        console.log(`Connecting effect ${fxName}`);
        fx.node = this.createFxCallbacks[fxName](fx.params);
        this.player.connect(fx.node);
      } else {// if (parameter !== "enabled" && !reconnect) {
        // Only need to write value to node if we've not reconnected
        fx.node[parameter] = value;
      }
    } else if (prevEnabled !== enabled && fx.node !== null) {
      console.log(`Disconnecting effect ${fxName}`);
      this.player.disconnect(fx.node);
      fx.node = null;
    }
  }

  createDistortionFx(params) {
    return new Tone.Distortion(params["amount"]["value"]).toDestination();
  }

  createReverbFx(params) {
    return new Tone.Reverb(params["amount"]["value"]).toDestination();
  }

  createDelayFx(params) {
    return new Tone.PingPongDelay(
      params["amount"]["value"],
      0.2
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
