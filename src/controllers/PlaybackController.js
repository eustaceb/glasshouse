export class PlaybackController {
  constructor() {
    this.beatCallback = null;
  }

  setBeatCallback(fn) {
    this.beatCallback = fn;
  }
  setBeat(beat) {
    if (this.beatCallback) {
      this.beatCallback(beat);
    }
  }
}
