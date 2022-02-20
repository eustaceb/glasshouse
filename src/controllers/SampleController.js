import * as Tone from "tone";
import {FXController} from "./FXController";

class Sample {
  static PlayStates = {
    INACTIVE: 0,
    SCHEDULED: 1,
    PLAYING: 2,
  };

  static idCounter = 0;

  constructor(name, path, color, type, duration) {
    this.id = (Sample.idCounter++).toString(); // string type
    this.name = name;
    this.path = path;
    this.buffer = new Tone.Buffer(path);
    this.type = type;
    this.player = new Tone.Player(this.buffer, () => {
      console.log("Loaded " + this.name);
    });
    this.player.toDestination().sync();
    this.color = color;
    this.duration = duration;
    this.startPlaybackCallback = null;
    this.endPlaybackCallback = null;
    this.fx = new FXController(this.player);
    this.playState = Sample.PlayStates.INACTIVE;
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
}

export class SampleController {
  constructor() {
    this.samplesPlaying = 0;
    // @TODO: Load from JSON
    this.samples = [
      {
        name: "808 clap 1",
        path: "audio/808_clap_Loop_1.mp3",
        color: "#A77E1F",
        type: "loop",
        duration: 4,
      },
      {
        name: "808 clap 2",
        path: "audio/808_clap_Loop_2.mp3",
        color: "#0713ED",
        type: "loop",
        duration: 4,
      },
      {
        name: "808 1",
        path: "audio/808_Loop_1.mp3",
        color: "#1FF45B",
        type: "loop",
        duration: 2,
      },
      {
        name: "Back Vocals 1",
        path: "audio/Back_Vocals_One_Shot_1.mp3",
        color: "#4C7C0B",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Back Vocals 2",
        path: "audio/Back_Vocals_One_Shot_2.mp3",
        color: "#7B1E7E",
        type: "oneshot",
        duration: 1,
      },
      {
        name: "Back Vocals 3",
        path: "audio/Back_Vocals_One_Shot_3.mp3",
        color: "#6980E7",
        type: "oneshot",
        duration: 1,
      },
      {
        name: "Guitar Back",
        path: "audio/Guitar_Back_Loop.mp3",
        color: "#AAFC57",
        type: "loop",
        duration: 8,
      },
      {
        name: "Guitar 1",
        path: "audio/Guitar_One_Shot_1.mp3",
        color: "#27B914",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Guitar 2",
        path: "audio/Guitar_One_Shot_2.mp3",
        color: "#D91FBC",
        type: "oneshot",
        duration: 4,
      },
      {
        name: "Guitar 3",
        path: "audio/Guitar_One_Shot_3.mp3",
        color: "#39F28A",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Main Vocals 1",
        path: "audio/Main_Vocals_One_Shot_1.mp3",
        color: "#16999E",
        type: "oneshot",
        duration: 16,
      },
      {
        name: "Main Vocals 10",
        path: "audio/Main_Vocals_One_Shot_10.mp3",
        color: "#1FD160",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Main Vocals 11",
        path: "audio/Main_Vocals_One_Shot_11.mp3",
        color: "#71F595",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Main Vocals 12",
        path: "audio/Main_Vocals_One_Shot_12.mp3",
        color: "#64A0D8",
        type: "oneshot",
        duration: 8,
      },
      {
        name: "Main Vocals 13",
        path: "audio/Main_Vocals_One_Shot_13.mp3",
        color: "#D2AFF9",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Main Vocals 14",
        path: "audio/Main_Vocals_One_Shot_14.mp3",
        color: "#D34813",
        type: "oneshot",
        duration: 1,
      },
      {
        name: "Main Vocals 15",
        path: "audio/Main_Vocals_One_Shot_15.mp3",
        color: "#88034F",
        type: "oneshot",
        duration: 1,
      },
      {
        name: "Main Vocals 16",
        path: "audio/Main_Vocals_One_Shot_16.mp3",
        color: "#8CF662",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Main Vocals 2",
        path: "audio/Main_Vocals_One_Shot_2.mp3",
        color: "#BE5B11",
        type: "oneshot",
        duration: 8,
      },
      {
        name: "Main Vocals 3",
        path: "audio/Main_Vocals_One_Shot_3.mp3",
        color: "#D5DA66",
        type: "oneshot",
        duration: 4,
      },
      {
        name: "Main Vocals 4",
        path: "audio/Main_Vocals_One_Shot_4.mp3",
        color: "#AEFFA4",
        type: "oneshot",
        duration: 4,
      },
      {
        name: "Main Vocals 5",
        path: "audio/Main_Vocals_One_Shot_5.mp3",
        color: "#B1A4D3",
        type: "oneshot",
        duration: 8,
      },
      {
        name: "Main Vocals 6",
        path: "audio/Main_Vocals_One_Shot_6.mp3",
        color: "#BAE4B3",
        type: "oneshot",
        duration: 8,
      },
      {
        name: "Main Vocals 7",
        path: "audio/Main_Vocals_One_Shot_7.mp3",
        color: "#CA5370",
        type: "oneshot",
        duration: 16,
      },
      {
        name: "Main Vocals 8",
        path: "audio/Main_Vocals_One_Shot_8.mp3",
        color: "#BF694E",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Main Vocals 9",
        path: "audio/Main_Vocals_One_Shot_9.mp3",
        color: "#89394F",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Taiko 1",
        path: "audio/Taiko_Loop_1.mp3",
        color: "#71DBDA",
        type: "loop",
        duration: 2,
      },
      {
        name: "Vocals Whole Track",
        path: "audio/Vocals_Whole_Track.mp3",
        color: "#4C2830",
        type: "loop",
        duration: 99,
      },
      {
        name: "Vocal Cassette Tape",
        path: "audio/Vocal_Cassette_Tape_One_Shot.mp3",
        color: "#D22568",
        type: "oneshot",
        duration: 2,
      },
      {
        name: "Wavetable Bass 1",
        path: "audio/Wavetable_Bass_Loop_1.mp3",
        color: "#B2FE77",
        type: "loop",
        duration: 2,
      },
    ].map(
      (sample) =>
        new Sample(
          sample.name,
          sample.path,
          sample.color,
          sample.type,
          sample.duration
        )
    );

    // The play queue is an array of durations remaining to play
    this.playQueue = new Array(this.samples.length).fill(0);

    // The finished queue is where samples go after they are finished playing
    this.finishedQueue = new Array();

    // Sample indices that are about to end
    this.lapsingQueue = new Array();

    // Sample indices that are about to be triggered for the first time
    this.firstPlayQueue = new Array();
  }

  getSamples() {
    return this.samples;
  }

  tick(time) {
    // Warning: this is intended to run in audio scheduler loop
    for (var i = 0; i < this.playQueue.length; i++) {
      const duration = this.playQueue[i];
      if (duration == 0) continue;

      // Check if a sample should be triggered
      if (duration == this.samples[i].duration) {
        this.samples[i].play(Tone.Time(time) + Tone.Time("16n"));
      }

      // Reduce remaining duration by 1
      this.playQueue[i] = Math.max(0, this.playQueue[i] - 1);

      // If the sample is about to stop playing, double check if it needs relooping
      if (this.playQueue[i] === 0 && this.samples[i].isLoop())
        this.playQueue[i] = this.samples[i].duration;

      if (
        !this.samples[i].isLoop() &&
        duration === 1 &&
        this.playQueue[i] === 0
      )
        this.lapsingQueue.push(i);
    }
  }

  isSampleLapsing(index) {
    return this.lapsingQueue.find((n) => n === index);
  }

  isSampleFinished(index) {
    return this.finishedQueue.find((n) => n === index);
  }

  isSamplePlaying(index) {
    //TODO: Simply mark samples as playing and unmark on 0
    // Lapsed duration is 0 + item not in lapsing or finished queues
    // OR lapsed duration is equal to loop duration
    if (this.playQueue[index] === 0) {
      if (!this.isSampleLapsing(index) && !this.isSampleFinished(index)) {
        return false;
      }
    }

    // Not yet triggered
    // Edge case: loop
    if (this.samples[index].duration === this.playQueue[index]) {
      return false;
    }

    return true;
  }

  triggerCallbacks() {
    // Warning: should be run in draw loop as it's slow
    for (var i = 0; i < this.finishedQueue.length; i++) {
      // Make sure that it's not started playing again
      const finishedSampleId = this.finishedQueue[i];
      if (this.playQueue[finishedSampleId] === 0) {
        this.samples[finishedSampleId].setInactive();
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

  playSample(sampleIndex) {
    this.playQueue[sampleIndex] = this.samples[sampleIndex].duration;
    this.firstPlayQueue.push(sampleIndex);
  }
  stopSample(sampleIndex) {
    this.playQueue[sampleIndex] = 0;
  }
}
