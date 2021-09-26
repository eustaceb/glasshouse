import * as Tone from "tone";

// class FxParam {
//   constructor(name, displayName, min, max, initialValue) {
//     this.name = name;
//     this.displayName = displayName;
//     this.min = min;
//     this.max = max;
//     this.value = initialValue;
//   }
// }

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

    this.effects = {};
    this.effects["distortion"] = new Fx(
      "distortion",
      {amount: {range: [0, 100], value: 0}, enabled: {value: false}},
      (params) => params["enabled"]["value"] === true && params["amount"]["value"] > 0
    );
    this.effects["reverb"] = new Fx(
      "reverb",
      {amount: {range: [0, 100], value: 0}, enabled: {value: false}},
      (params) => params["enabled"]["value"] === true && params["amount"]["value"] > 0
    );
    this.effects["delay"] = new Fx(
      "delay",
      {amount: {range: [0, 100], value: 0}, enabled: {value: false}},
      (params) => params["enabled"]["value"] === true && params["amount"]["value"] > 0
    );
    this.effects["chorus"] = new Fx(
      "chorus",
      {
        frequency: {range: [0, 10], value: 0},
        delayTime: {range: [0, 100], value: 0},
        depth: {range: [0, 1], value: 0},
        enabled: {value: false},
      },
      (params) => params["enabled"]["value"]
    );
  }

  setFxParam(fxName, parameter, value) {
    const fx = this.effects[fxName];
    const prevEnabled = fx.isEnabled();

    fx.params[parameter]["value"] = value;
    const enabled = fx.isEnabled();

    // If we're disabling an effect, simply disconnect it and update state
    if (fx.isEnabled()) {
      if (prevEnabled !== enabled) {
        console.log(`Connecting effect ${fxName}`);
        fx.node = this.createFxCallbacks[fxName](fx.params);
        this.player.connect(fx.node);
      }
      if (parameter !== "enabled") {
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
