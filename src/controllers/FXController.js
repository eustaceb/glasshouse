import * as Tone from "tone";

export class FXController {
  constructor(player) {
    this.player = player;

    this.fxState = {};
    this.fxState["distortion"] = {enabled: false, amount: 0, node: null};
    this.fxState["reverb"] = {enabled: false, amount: 0, node: null};
    this.fxState["delay"] = {enabled: false, amount: 0, node: null};
  }

  setFxAmount(fxName, amount, createFxCallback) {
    // If we're disabling an effect, simply disconnect it and update state
    if (amount === 0 && this.fxState[fxName]["enabled"]) {
      this.player.disconnect(this.fxState[fxName]["node"]);
      this.fxState[fxName]["enabled"] = false;
    } else {
      // Otherwise, we're enabling an effect.
      // If it's been enabled already, we must first disconnect the current node
      if (this.fxState[fxName]["enabled"])
        this.player.disconnect(this.fxState[fxName]["node"]);

      // Prior to creating the new node and connecting it up
      this.fxState[fxName]["node"] = createFxCallback(amount);
      this.player.connect(this.fxState[fxName]["node"]);
      this.fxState[fxName]["enabled"] = true;
    }

    this.fxState[fxName]["amount"] = amount;
  }

  setDistortionAmount(amount) {
    this.setFxAmount("distortion", amount, (amount) => {
      return new Tone.Distortion(amount).toDestination();
    });
  }

  setReverbAmount(amount) {
    this.setFxAmount("reverb", amount, (amount) => {
      return new Tone.Reverb(amount).toDestination();
    });
  }

  setDelayAmount(amount) {
    this.setFxAmount("delay", amount, (amount) => {
      return new Tone.PingPongDelay(amount, 0.2).toDestination();
    });
  }
}
