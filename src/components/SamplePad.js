import React, {useState} from "react";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

export function SamplePad(props) {
  const padStates = {
    READY: 0,
    SCHEDULING: 1,
    PLAYING: 2
  };
  const [padState, setPadState] = useState(padStates.READY);
  const cell = props.cell;
  const sample = props.cell.sample;

  const triggerSample = () => {
    console.log(`triggerSample | isPlaying:${sample.isPlaying()} isInactive:${sample.isInactive()}`)
    if (sample.isInactive()) {
      // Register end playback callback that will rerender this UI if not looping
      sample.setEndPlaybackCallback(() => setPadState(padStates.READY));
      sample.setStartPlaybackCallback(() => setPadState(padStates.PLAYING));
      props.playSample();
      setPadState(padStates.SCHEDULING);
    } else if (sample.isPlaying()) {
      props.stopSample();
      setPadState(padStates.SCHEDULING);
    }
  };

  return (
      <div
        style={{backgroundColor: cell.getColor(), position: "relative"}}
        onClick={() => triggerSample()}
        className={ padState === padStates.SCHEDULING ? "pad blinking" : "pad"}>
        <div style={{position: "relative"}}>
          <div className={padState === padStates.PLAYING ? "beatStrip" : ""} />
        </div>
        <div style={{padding: "1%"}}>
          <p className="sampleLabel">{cell.getName() + `${sample.duration} bars`}</p>
          <p style={{textAlign: "center"}}>{padState === padStates.PLAYING && <VolumeUpIcon />}</p>
        </div>
      </div>
  );
}
