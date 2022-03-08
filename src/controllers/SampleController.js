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
    this.id = (Sample.idCounter++);
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
        name: "Bass Chorus",
        path: "audio/Bass/Bass_Chorus_4bar.mp3",
        color: "#0D168F",
        type: "loop",
        duration: 4,
        category: "Bass",
      },
      {
        name: "Bass End",
        path: "audio/Bass/Bass_End_4bar.mp3",
        color: "#9F0C02",
        type: "loop",
        duration: 4,
        category: "Bass",
      },
      {
        name: "Bass Intro",
        path: "audio/Bass/Bass_Intro_2bar.mp3",
        color: "#995FBD",
        type: "loop",
        duration: 2,
        category: "Bass",
      },
      {
        name: "Bass LongerNote",
        path: "audio/Bass/Bass_LongerNote_2bar.mp3",
        color: "#75DF54",
        type: "loop",
        duration: 2,
        category: "Bass",
      },
      {
        name: "Bass Melodic",
        path: "audio/Bass/Bass_Melodic_2bar.mp3",
        color: "#02D2AF",
        type: "loop",
        duration: 2,
        category: "Bass",
      },
      {
        name: "Chiral Synth",
        path: "audio/Misc/Chiral_Synth_4bar.mp3",
        color: "#78FD11",
        type: "loop",
        duration: 4,
        category: "Misc",
      },
      {
        name: "Sham HighPluck",
        path: "audio/Misc/Sham_HighPluck_4bar.mp3",
        color: "#1AF1C8",
        type: "loop",
        duration: 4,
        category: "Misc",
      },
      {
        name: "Perc fifth",
        path: "audio/Percussion/Perc_fifth_2bar.mp3",
        color: "#4D3152",
        type: "loop",
        duration: 2,
        category: "Percussion",
      },
      {
        name: "Perc first",
        path: "audio/Percussion/Perc_first_1bar.mp3",
        color: "#C239A0",
        type: "loop",
        duration: 1,
        category: "Percussion",
      },
      {
        name: "Perc fourth",
        path: "audio/Percussion/Perc_fourth_2bar.mp3",
        color: "#A2C7E3",
        type: "loop",
        duration: 2,
        category: "Percussion",
      },
      {
        name: "Perc second",
        path: "audio/Percussion/Perc_second_1bar.mp3",
        color: "#55F229",
        type: "loop",
        duration: 1,
        category: "Percussion",
      },
      {
        name: "Perc seventh",
        path: "audio/Percussion/Perc_seventh_1bar.mp3",
        color: "#C3C2E3",
        type: "loop",
        duration: 1,
        category: "Percussion",
      },
      {
        name: "Perc sixth",
        path: "audio/Percussion/Perc_sixth_1bar.mp3",
        color: "#5D5230",
        type: "loop",
        duration: 1,
        category: "Percussion",
      },
      {
        name: "Perc third",
        path: "audio/Percussion/Perc_third_2bar.mp3",
        color: "#3FEF32",
        type: "loop",
        duration: 2,
        category: "Percussion",
      },
      {
        name: "Sham first",
        path: "audio/Sham_Bass_Pluck/Sham_first_4bar.mp3",
        color: "#7C203D",
        type: "loop",
        duration: 4,
        category: "Sham_Bass_Pluck",
      },
      {
        name: "Sham Last",
        path: "audio/Sham_Bass_Pluck/Sham_Last_8bar.mp3",
        color: "#E0048B",
        type: "loop",
        duration: 8,
        category: "Sham_Bass_Pluck",
      },
      {
        name: "Sham Main",
        path: "audio/Sham_Bass_Pluck/Sham_Main_8bar.mp3",
        color: "#ADF7A0",
        type: "loop",
        duration: 8,
        category: "Sham_Bass_Pluck",
      },
      {
        name: "Vocals BRIDGE",
        path: "audio/Vocals_Sections/Vocals_BRIDGE_18bar.mp3",
        color: "#145453",
        type: "loop",
        duration: 18,
        category: "Vocals_Sections",
      },
      {
        name: "Vocals ChorusOne",
        path: "audio/Vocals_Sections/Vocals_ChorusOne_16bar.mp3",
        color: "#FD5D35",
        type: "loop",
        duration: 16,
        category: "Vocals_Sections",
      },
      {
        name: "Vocals ChorusTWO",
        path: "audio/Vocals_Sections/Vocals_ChorusTWO_20bar.mp3",
        color: "#734ECB",
        type: "loop",
        duration: 20,
        category: "Vocals_Sections",
      },
      {
        name: "Vocals Intro",
        path: "audio/Vocals_Sections/Vocals_Intro_4bar.mp3",
        color: "#C9124F",
        type: "loop",
        duration: 4,
        category: "Vocals_Sections",
      },
      {
        name: "Vocals Outro",
        path: "audio/Vocals_Sections/Vocals_Outro_16bar.mp3",
        color: "#B9880D",
        type: "loop",
        duration: 16,
        category: "Vocals_Sections",
      },
      {
        name: "Vocals VerseOne",
        path: "audio/Vocals_Sections/Vocals_VerseOne_24bar.mp3",
        color: "#BFB804",
        type: "loop",
        duration: 24,
        category: "Vocals_Sections",
      },
      {
        name: "Vocals VerseTwo",
        path: "audio/Vocals_Sections/Vocals_VerseTwo_15bar.mp3",
        color: "#A80448",
        type: "loop",
        duration: 15,
        category: "Vocals_Sections",
      },
      {
        name: "Volca FM first",
        path: "audio/Volca_FM/Volca_FM_first_4bar.mp3",
        color: "#75C26D",
        type: "loop",
        duration: 4,
        category: "Volca_FM",
      },
      {
        name: "Volca FM fourth",
        path: "audio/Volca_FM/Volca_FM_fourth_4bar.mp3",
        color: "#CD9D33",
        type: "loop",
        duration: 4,
        category: "Volca_FM",
      },
      {
        name: "Volca FM second",
        path: "audio/Volca_FM/Volca_FM_second_8bar.mp3",
        color: "#A8A5B1",
        type: "loop",
        duration: 8,
        category: "Volca_FM",
      },
      {
        name: "Volca FM third",
        path: "audio/Volca_FM/Volca_FM_third_8bar.mp3",
        color: "#F113AC",
        type: "loop",
        duration: 8,
        category: "Volca_FM",
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
        if (this.samples[finishedSampleId].isLoop()) {
          this.terminateLoopQueue = this.terminateLoopQueue.filter(
            (sampleId) => sampleId != finishedSampleId
          );
        }
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
    this.playQueue[sampleId] = this.samples[sampleId].duration;
    this.firstPlayQueue.push(sampleId);
  }
  playSampleByName(sampleName) {
    const sampleId = this.getSampleByName(sampleName).id;
    this.playSample(sampleId);
  }
  stopSample(sampleId) {
    // For now, only stop loops
    if (this.samples[sampleId].isLoop()) {
      this.terminateLoopQueue.push(sampleId);
    }
  }
}
