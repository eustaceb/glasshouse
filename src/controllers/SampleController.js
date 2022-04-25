import * as Tone from "tone";

class Sample {
  static PlayStates = {
    INACTIVE: 0,
    SCHEDULED: 1,
    PLAYING: 2,
  };

  static idCounter = 0;

  constructor(name, player, color, type, duration) {
    this.id = Sample.idCounter++;
    this.name = name;
    this.type = type;
    this.player = player;
    this.player.sync();
    this.color = color;
    this.duration = duration;
    this.startPlaybackCallback = null;
    this.endPlaybackCallback = null;
    this.playState = Sample.PlayStates.INACTIVE;
    this.player.fadeOut = 0.1;
  }
  play(time) {
    this.player.start(time);
  }
  stop(time) {
    this.player.stop(time);
  }
  setStartPlaybackCallback(callback) {
    this.startPlaybackCallback = callback;
  }
  setEndPlaybackCallback(callback) {
    this.endPlaybackCallback = callback;
  }
  isInactive() {
    return this.playState === Sample.PlayStates.INACTIVE;
  }
  setInactive() {
    this.playState = Sample.PlayStates.INACTIVE;
  }
  isScheduled() {
    return this.playState === Sample.PlayStates.SCHEDULED;
  }
  setScheduled() {
    this.playState = Sample.PlayStates.SCHEDULED;
  }
  isPlaying() {
    return this.playState === Sample.PlayStates.PLAYING;
  }
  setPlaying() {
    this.playState = Sample.PlayStates.PLAYING;
  }
  isLoop() {
    return this.type === "loop";
  }
  getPlayer() {
    return this.player;
  }
}

export class SampleController {
  constructor(data, players) {
    this.samplesPlaying = 0;
    this.samples = data.map(
      (sample, index) =>
        new Sample(
          sample.name,
          players[index],
          "#611932",
          sample.type,
          sample.duration
        )
    );

    // The first sample in list is a background sample that will persist throughout the composition
    this.backgroundSample = this.samples[0];

    // The play queue is an array of durations remaining to play
    this.playQueue = new Array(this.samples.length).fill(0);

    // The finished queue is where samples go after they are finished playing
    this.finishedQueue = new Array();

    // Sample indices that are about to end
    this.lapsingQueue = new Array();

    // Sample indices that are about to be triggered for the first time
    this.firstPlayQueue = new Array();

    // Sample indices that are not be relooped
    this.terminateLoopQueue = new Array();
  }

  getSamples() {
    return this.samples;
  }

  getSampleByName(sampleName) {
    const sample = this.samples.find((s) => s.name == sampleName);
    console.assert(sample, `Sample ${sampleName} not found`);
    return sample;
  }

  tick(time) {
    // Warning: this is intended to run in audio scheduler loop
    for (var i = 0; i < this.playQueue.length; i++) {
      const duration = this.playQueue[i];
      if (duration == 0) continue;

      // Check if a sample should be stopped
      if (this.terminateLoopQueue.includes(i)) {
        this.samples[i].stop(Tone.Time(time) + Tone.Time("16n"));
        this.playQueue[i] = 0;
        this.finishedQueue.push(i);
        continue;
      }

      // Check if a sample should be triggered
      if (duration == this.samples[i].duration) {
        this.samples[i].play(Tone.Time(time) + Tone.Time("16n"));
      }

      // Reduce remaining duration by 1
      this.playQueue[i] = Math.max(0, this.playQueue[i] - 1);
      const reloop =
        this.samples[i].isLoop() && !this.terminateLoopQueue.includes(i);

      //console.log(`Reloop ${reloop} duration ${duration} playQ[${i}] ${this.playQueue[i]}`);

      // If the sample is about to stop playing, double check if it needs relooping
      if (this.playQueue[i] === 0 && reloop)
        this.playQueue[i] = this.samples[i].duration;
      if (!reloop && duration === 1 && this.playQueue[i] === 0) {
        this.lapsingQueue.push(i);
      }
    }
  }

  isSampleLapsing(index) {
    return this.lapsingQueue.find((n) => n === index);
  }

  isSampleFinished(index) {
    return this.finishedQueue.find((n) => n === index);
  }

  triggerCallbacks() {
    // Warning: should be run in draw loop as it's slow
    for (var i = 0; i < this.finishedQueue.length; i++) {
      // Make sure that it's not started playing again
      const finishedSampleId = this.finishedQueue[i];
      if (this.playQueue[finishedSampleId] === 0) {
        this.samples[finishedSampleId].setInactive();
        this.terminateLoopQueue = this.terminateLoopQueue.filter(
          (sampleId) => sampleId !== finishedSampleId
        );
        if (this.samples[finishedSampleId].endPlaybackCallback !== null) {
          this.samples[finishedSampleId].endPlaybackCallback();
        }
      }
    }
    for (var i = 0; i < this.firstPlayQueue.length; i++) {
      const sampleId = this.firstPlayQueue[i];
      this.samples[sampleId].setPlaying();
      if (this.samples[sampleId].startPlaybackCallback !== null) {
        this.samples[sampleId].startPlaybackCallback();
      }
    }
    this.finishedQueue = this.lapsingQueue;
    this.lapsingQueue = new Array();
    this.firstPlayQueue = new Array();
  }

  playSample(sampleId) {
    this.samples[sampleId].setScheduled(true);
    this.playQueue[sampleId] = this.samples[sampleId].duration;
    this.firstPlayQueue.push(sampleId);
  }

  playBackgroundSample() {
    this.playSample(this.backgroundSample.id);
  }

  playSampleByName(sampleName) {
    const sampleId = this.getSampleByName(sampleName).id;
    this.playSample(sampleId);
  }

  stopSample(sampleId) {
    // Cancel if scheduled
    if (this.firstPlayQueue.includes(sampleId)) {
      this.firstPlayQueue = this.firstPlayQueue.filter((s) => s !== sampleId);
      this.playQueue[sampleId] = 0;
      this.samples[sampleId].setInactive();
      this.samples[sampleId].endPlaybackCallback();
    } else {
      // Otherwise, terminate on next bar
      this.terminateLoopQueue.push(sampleId);
    }
  }

  stopAllSamples() {
    this.samples.forEach((sample) => {
      if (sample.id !== this.backgroundSample.id && sample.isPlaying()) {
        // Clear callback since it's a React state update for a component that will soon disappear
        sample.setEndPlaybackCallback(null);
        this.terminateLoopQueue.push(sample.id);
      }
    });
  }
}
