import * as Tone from "tone";
import {FXController} from "./FXController";

class Sample {
  constructor(name, path, color) {
    this.name = name;
    this.path = path;
    this.buffer = new Tone.Buffer(path);
    this.player = new Tone.Player(this.buffer, () => {
      console.log("Loaded " + this.name);
    });
    this.player.toDestination().sync();
    this.isLooping = true;
    this.isPlaying = false;
    this.color = color;
    this.endPlaybackCallback = null;
    this.donePlaying = false;
    this.fx = new FXController(this.player);
  }
  setLoop(loop) {
    this.isLooping = loop;
  }
  trigger() {
    this.isPlaying = !this.isPlaying;
    if (!this.isLooping) this.donePlaying = false;
  }
  play(time) {
    this.player.start(time);
  }
  stop(time) {
    this.player.stop(time);
  }
  setEndPlaybackCallback(callback) {
    this.endPlaybackCallback = callback;
  }
}

export class SampleController {
  constructor() {
    // @TODO: Load from JSON
    this.samples = [
      {
        name: "808 clap 1",
        path: "audio/808_clap_Loop_1.mp3",
        color: "#A77E1F",
        type: "loop",
        length: 4,
      },
      {
        name: "808 clap 2",
        path: "audio/808_clap_Loop_2.mp3",
        color: "#0713ED",
        type: "loop",
        length: 4,
      },
      {
        name: "808 1",
        path: "audio/808_Loop_1.mp3",
        color: "#1FF45B",
        type: "loop",
        length: 2,
      },
      {
        name: "Back Vocals 1",
        path: "audio/Back_Vocals_One_Shot_1.mp3",
        color: "#4C7C0B",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Back Vocals 2",
        path: "audio/Back_Vocals_One_Shot_2.mp3",
        color: "#7B1E7E",
        type: "oneshot",
        length: 1,
      },
      {
        name: "Back Vocals 3",
        path: "audio/Back_Vocals_One_Shot_3.mp3",
        color: "#6980E7",
        type: "oneshot",
        length: 1,
      },
      {
        name: "Guitar Back",
        path: "audio/Guitar_Back_Loop.mp3",
        color: "#AAFC57",
        type: "loop",
        length: 8,
      },
      {
        name: "Guitar 1",
        path: "audio/Guitar_One_Shot_1.mp3",
        color: "#27B914",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Guitar 2",
        path: "audio/Guitar_One_Shot_2.mp3",
        color: "#D91FBC",
        type: "oneshot",
        length: 4,
      },
      {
        name: "Guitar 3",
        path: "audio/Guitar_One_Shot_3.mp3",
        color: "#39F28A",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Main Vocals 1",
        path: "audio/Main_Vocals_One_Shot_1.mp3",
        color: "#16999E",
        type: "oneshot",
        length: 16,
      },
      {
        name: "Main Vocals 10",
        path: "audio/Main_Vocals_One_Shot_10.mp3",
        color: "#1FD160",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Main Vocals 11",
        path: "audio/Main_Vocals_One_Shot_11.mp3",
        color: "#71F595",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Main Vocals 12",
        path: "audio/Main_Vocals_One_Shot_12.mp3",
        color: "#64A0D8",
        type: "oneshot",
        length: 8,
      },
      {
        name: "Main Vocals 13",
        path: "audio/Main_Vocals_One_Shot_13.mp3",
        color: "#D2AFF9",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Main Vocals 14",
        path: "audio/Main_Vocals_One_Shot_14.mp3",
        color: "#D34813",
        type: "oneshot",
        length: 1,
      },
      {
        name: "Main Vocals 15",
        path: "audio/Main_Vocals_One_Shot_15.mp3",
        color: "#88034F",
        type: "oneshot",
        length: 1,
      },
      {
        name: "Main Vocals 16",
        path: "audio/Main_Vocals_One_Shot_16.mp3",
        color: "#8CF662",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Main Vocals 2",
        path: "audio/Main_Vocals_One_Shot_2.mp3",
        color: "#BE5B11",
        type: "oneshot",
        length: 8,
      },
      {
        name: "Main Vocals 3",
        path: "audio/Main_Vocals_One_Shot_3.mp3",
        color: "#D5DA66",
        type: "oneshot",
        length: 4,
      },
      {
        name: "Main Vocals 4",
        path: "audio/Main_Vocals_One_Shot_4.mp3",
        color: "#AEFFA4",
        type: "oneshot",
        length: 4,
      },
      {
        name: "Main Vocals 5",
        path: "audio/Main_Vocals_One_Shot_5.mp3",
        color: "#B1A4D3",
        type: "oneshot",
        length: 8,
      },
      {
        name: "Main Vocals 6",
        path: "audio/Main_Vocals_One_Shot_6.mp3",
        color: "#BAE4B3",
        type: "oneshot",
        length: 8,
      },
      {
        name: "Main Vocals 7",
        path: "audio/Main_Vocals_One_Shot_7.mp3",
        color: "#CA5370",
        type: "oneshot",
        length: 16,
      },
      {
        name: "Main Vocals 8",
        path: "audio/Main_Vocals_One_Shot_8.mp3",
        color: "#BF694E",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Main Vocals 9",
        path: "audio/Main_Vocals_One_Shot_9.mp3",
        color: "#89394F",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Taiko 1",
        path: "audio/Taiko_Loop_1.mp3",
        color: "#71DBDA",
        type: "loop",
        length: 2,
      },
      {
        name: "Vocals Whole Track",
        path: "audio/Vocals_Whole_Track.mp3",
        color: "#4C2830",
        type: "loop",
        length: 99,
      },
      {
        name: "Vocal Cassette Tape",
        path: "audio/Vocal_Cassette_Tape_One_Shot.mp3",
        color: "#D22568",
        type: "oneshot",
        length: 2,
      },
      {
        name: "Wavetable Bass 1",
        path: "audio/Wavetable_Bass_Loop_1.mp3",
        color: "#B2FE77",
        type: "loop",
        length: 2,
      },
    ].map((sample) => new Sample(sample.name, sample.path, sample.color));
  }
  getSamples() {
    return this.samples;
  }
  playSample(sampleIndex) {
    this.samples[sampleIndex].play();
  }
}
