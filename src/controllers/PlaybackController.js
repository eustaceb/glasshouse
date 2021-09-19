import * as Tone from "tone";

export class PlaybackController {
  constructor(sampleController) {
    this.beatCallback = null;
    this.beat = 0;
    this.scheduled = false;
    this.sampleController = sampleController;
    this.started == false;
  }
  start(time) {
    if (!this.scheduled) {
      console.log("Scheduling repeat");
      Tone.Transport.scheduleRepeat((t) => this.tick(t), "16n");
      this.scheduled = true;
    }
    if (!this.started) {
      console.log(`Starting playback at ${time}`);
      Tone.Transport.start(time);
      this.started = true;
    }
  }
  setBeatCallback(fn) {
    this.beatCallback = fn;
  }
  tick(time) {
    const [bar, beat, sixteenth] = Tone.Time(time).toBarsBeatsSixteenths().split(".")[0].split(":");
    console.log(Tone.Time(time).toBarsBeatsSixteenths());

    // Update visuals every quarter note, prescheduling 1/16th ahead
    if (sixteenth === 3) {
      Tone.Draw.schedule(function () {
        // pop from draw queue to render
        const pads = document.querySelectorAll(".beatStrip");
        const increments = [0, 33, 66, 100];

        pads.forEach(function (el) {
          el.style.width = increments[beat].toString() + "%";
        });

        // Any other callbacks
        this.beatCallback?.(beat);
      }, "+16n"); // TODO: May need a different time value
    }
  }
  GetNextBar() {
    return Tone.Transport.nextSubdivision("1n");
  }
}
