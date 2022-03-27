import React, {useState} from "react";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

export function SamplePad(props) {
  const padStates = {
    READY: 0,
    SCHEDULING_PLAY: 1,
    PLAYING: 2,
    SCHEDULING_STOP: 3,
  };
  const [padState, setPadState] = useState(padStates.READY);
  const sample = props.sample;
  const scheduling =
    padState === padStates.SCHEDULING_PLAY ||
    padState === padStates.SCHEDULING_STOP;
  const playing =
    padState === padStates.SCHEDULING_STOP || padState === padStates.PLAYING;

  const triggerSample = () => {
    if (sample.isInactive()) {
      // Register end playback callback that will rerender this UI if not looping
      sample.setEndPlaybackCallback(() => setPadState(padStates.READY));
      sample.setStartPlaybackCallback(() => setPadState(padStates.PLAYING));
      props.playSample();
      setPadState(padStates.SCHEDULING_PLAY);
    } else if (sample.isPlaying()) {
      props.stopSample();
      setPadState(padStates.SCHEDULING_STOP);
    }
  };

  return (
    <div
      style={{backgroundColor: sample.color, position: "relative"}}
      onClick={() => triggerSample()}
      className={scheduling ? "pad blinking" : "pad"}>
      <div style={{position: "relative"}}>
        <div className={playing ? "beatStrip" : ""} />
      </div>
      <div style={{padding: "1%"}}>
        <p className="sampleLabel">
          {sample.name + ` ${sample.duration} bars`}
        </p>
        <p style={{textAlign: "center"}}>
          {playing ? <VolumeUpIcon /> : <VolumeOffIcon />}
        </p>
      </div>
    </div>
  );
}
