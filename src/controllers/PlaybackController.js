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
    if (!this.started) {
      console.log(`Starting playback at ${time}`);
      Tone.Transport.start(time);
      this.started = true;
    }
    if (!this.scheduled) {
      console.log("Scheduling repeat");
      Tone.Transport.scheduleRepeat((t) => this.tick(t), "16n");
      this.scheduled = true;
    }
  }
  setBeatCallback(fn) {
    this.beatCallback = fn;
  }
  tick(time) {
    const timestamp = Tone.Time(time).toBarsBeatsSixteenths().split(".")[0];
    const [bar, beat, sixteenth] = timestamp.split(":");

    // Trigger next set of samples
    if (beat === "3" && sixteenth === "3") {
      this.sampleController.tick(time);
    }

    // Update visuals every quarter note, prescheduling 1/16th ahead
    Tone.Draw.schedule(function () {
      document.querySelector("#timestamp").innerHTML = timestamp;
      if (sixteenth === "3") {
        const pads = document.querySelectorAll(".beatStrip");
        const increments = [0, 33, 66, 100];

        pads.forEach(function (el) {
          el.style.width = increments[beat].toString() + "%";
        });

        // Any other callbacks
        this.beatCallback?.(beat);
      }
    }, "+16n");
  }
}
