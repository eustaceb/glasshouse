import * as Tone from "tone";

class LoopQueue {
  constructor() {
    this.lapsingSamples = []; // (duration, sample)
    this.terminationQueue = [];
    this.endCallbacks = {};
  }
  enqueue(sample) {
    console.debug(`Enqueuing ${sample.name} to LoopQueue (size ${this.lapsingSamples.length})`);
    this.lapsingSamples.push({'duration': sample.duration, 'sample': sample});
    this.endCallbacks[sample.id] = endCallback;
  }
  clear() {
    this.lapsingSamples = [];
    this.terminationQueue = [];
  }
  dequeue(sample) {
    console.debug(`Dequeuing loop ${sample.name}`);
    const sampleIndex = this.lapsingSamples.findIndex(ls => sample.id === ls.sample.id);
    this.terminationQueue.push(this.lapsingSamples[sampleIndex]);
    this.lapsingSamples = this.lapsingSamples.filter(ls => ls.sample.id !== sample.id);
  }
  triggerSamples() {
    this.lapsingSamples.forEach(ls => {
      if (ls.duration === ls.sample.duration) {
        console.debug(`Playing loop ${ls.sample.name}`);
        sample.play();
      }
    });
  }
  tick() {
    this.lapsingSamples = this.lapsingSamples.filter(ls => {
      if (ls.duration === ls.sample.duration) {
        console.debug(`Ending playback for loop ${ls.sample.name}`);
        ls.sample.endPlaybackCallback?.(); // TODO: possibly expensive call, make async or enqueue draw call via Tone.Draw.schedule
        this.endCallbacks[ls.sample.id]();
      }
      return true;
    })
    this.terminationQueue = this.terminationQueue.filter(ls => ls.sample.duration !== 0);
    this.terminationQueue.forEach((ls, i, arr) => arr[i].duration -= 1);
    this.lapsingSamples.forEach((ls, i, arr) => arr[i].duration -= 1);
  }
  size() {
    return this.terminationQueue.length + this.lapsingSamples.length;
  }
}

class OneShotQueue {
  constructor() {
    this.samples = [];
    this.lapsingSamples = []; // (duration, sample)
    this.endCallbacks = {};
  }
  enqueue(sample, endCallback) {
    console.log(`Enqueuing ${sample.name} to OneShotQueue (size ${this.samples.length} ${this.lapsingSamples.length})`);
    this.samples.push(sample);
    this.endCallbacks[sample.id] = endCallback;
  }
  clear() {
    this.samples = [];
    this.lapsingSamples = [];
  }
  dequeue(sample) {
    console.log(`Dequeueing ${sample.name} will not have an effect as it's one shot`);
  }
  // interrupt(sample) {
  //   this.samples = this.lapsingSamples.filter(ls => {
  //     if (ls.sample.id === sample.id) {
  //       ls.sample.endPlaybackCallback(); // TODO: possibly expensive call, make async or enqueue draw call via Tone.Draw.schedule
  //       return false;
  //     }
  //     return true;
  //   });
  //   this.lapsingSamples = this.samples.filter(s => {
  //     if (s.id === sample.id) {
  //       s.endPlaybackCallback(); // TODO: possibly expensive call, make async or enqueue draw call via Tone.Draw.schedule
  //       return false;
  //     }
  //     return true;
  //   });
  // }
  triggerSamples() {
    this.samples.forEach(sample => {
      console.debug(`Triggering oneshot ${sample.name}`);
      sample.play();
      this.lapsingSamples.push({'duration': sample.duration, 'sample': sample});
    });
    this.samples = [];
  }
  tick() {
    this.lapsingSamples = this.lapsingSamples.filter(ls => {
      if (ls.duration === 0) {
        console.debug(`Ending playback for oneshot ${ls.sample.name}`);
        ls.sample.endPlaybackCallback?.(); // TODO: possibly expensive call, make async or enqueue draw call via Tone.Draw.schedule
        this.endCallbacks[ls.sample.id]();
        return false;
      }
      return true;
    });
    this.lapsingSamples.forEach((ls, i, arr) => arr[i].duration -= 1);
  }
  size() {
    return this.samples.length + this.lapsingSamples.length;
  }
}

class PlaybackQueue {
  constructor() {
    this.loopQueue = new LoopQueue();
    this.oneShotQueue = new OneShotQueue();
    this.samplesPlaying = {};
  }
  sampleEndCallback(sampleId) {
    this.samplesPlaying[sampleId] = false;
  }
  isPlaying(sampleId) {
    return this.samplesPlaying[sampleId];
  }
  enqueue(sample) {
    if (sample.type == "oneshot") {
      this.oneShotQueue.enqueue(sample, sampleId => this.sampleEndCallback(sampleId));
    } else { // loop
      this.loopQueue.enqueue(sample, sampleId => this.sampleEndCallback(sampleId));
    }
    this.samplesPlaying[sample.id] = true;
  }
  dequeue(sample) {
    if (sample.type == "oneshot") {
      this.oneShotQueue.dequeue(sample);
      // If this sample is currently playing
      // if (this.oneShotQueue.isSamplePlaying(sample.id)) {
      // }
    } else { // loop
      this.loopQueue.dequeue(sample);
    }
    //if (sample.id in this.samplesPlaying)
  }
  isEmpty() {
    return this.oneShotQueue.size() === 0 && this.loopQueue.size() === 0;
  }
  triggerSamples() {
    this.oneShotQueue.triggerSamples();
    this.loopQueue.triggerSamples();
  }
  tick() {
    this.oneShotQueue.tick();
    console.log(this.oneShotQueue);
    console.log(this.loopQueue);
    this.loopQueue.tick();
  }
}

export class PlaybackController {
  constructor(sampleController) {
    this.beatCallback = null;
    this.beat = 0;
    this.sampleController = sampleController;
    this.scheduled = false;
    this.running = false;
    this.playbackQueue = new PlaybackQueue();
  }
  trigger(sample) {
    if (!this.running) {
      this.start();
    }
    this.playbackQueue.enqueue(sample);
  }
  start(time = "+32n") {
    console.log("Starting playback");
    if (!this.scheduled) {
      Tone.Transport.scheduleRepeat((t) => this.tick(t),  "32n");
      this.scheduled = true;
    }
    if (!this.running) {
      console.log(`Starting playback at ${time}`);
      Tone.Transport.start(time);
      this.running = true;
    }
  }
  stop(time = "+32n") {
    console.log("Stopping playback");
    if (this.running) {
      Tone.Transport.stop();
      this.running = false;
      this.beat = 0;
    }
  }

  setBeatCallback(fn) {
    this.beatCallback = fn;
  }
  setBeat(beat) {
    this.beat = beat;
    if (this.beatCallback) {
      this.beatCallback(beat);
    }
  }
  tick(time) {
    const beat = this.beat;
    // Update visuals
    if (beat % 8 === 0) {
      Tone.Draw.schedule(function () {
        // pop from draw queue to render
        const pads = document.querySelectorAll(".beatStrip");
        const increments = [0, 33, 66, 100];

        pads.forEach(function (el) {
          el.style.width = increments[Math.round(beat / 8)].toString() + "%";
        });
      }, time); // TODO: May need a different time value
    }

    // Preschedule 1/32nd early
    if (beat === 31) {
      if (this.playbackQueue.isEmpty()) {
        console.debug(`Playback queue is empty - stopping playback`);
        this.stop();
      } else {
        this.playbackQueue.tick();
        this.playbackQueue.triggerSamples();
      }
    }

    // if (beat === 0) {
    //   // Each bar we update sample state
    //   this.sampleController.updateSamples();
    // }
    this.setBeat((beat + 1) % 32);
  }
}
