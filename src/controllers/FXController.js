import * as Tone from "tone";

export class FXController {
  constructor(player) {
    this.player = player;
    this.distortionAmount = 0;
  }

  enableDistortion(enable) {
    if (enable) {
      this.distortion = new Tone.Distortion(
        this.distortionAmount
      ).toDestination();
      this.player.connect(this.distortion);
    } else {
      this.player.disconnect(this.distortion);
    }
  }
  setDistortionAmount(amount) {
    this.distortionAmount = amount;
  }
}
