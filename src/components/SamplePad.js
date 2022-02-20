import React, {useState} from "react";
import LoopIcon from "@material-ui/icons/Loop";
import TuneIcon from "@material-ui/icons/Tune";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

export function SamplePad(props) {
  const padStates = {
    READY: 0,
    SCHEDULING: 1,
    PLAYING: 2
  };
  const [padState, setPadState] = useState(padStates.READY);

  const triggerSample = () => {
    if (props.sample.isInactive()) {
      // Register end playback callback that will rerender this UI if not looping
      props.sample.setEndPlaybackCallback(() => setPadState(padStates.READY));
      props.sample.setStartPlaybackCallback(() => setPadState(padStates.PLAYING));
      props.playSample();
      setPadState(padStates.SCHEDULING);
    } else if (props.sample.isPlaying()) {
      props.stopSample();
    }
  };

  return (
    <div>
      <div
        style={{backgroundColor: props.sample.color, position: "relative"}}
        onClick={() => triggerSample()}
        className={ padState === padStates.SCHEDULING ? "pad blinking" : "pad"}>
        <div style={{position: "relative"}}>
          <div className={padState === padStates.PLAYING ? "beatStrip" : ""} />
        </div>
        <div style={{padding: "1%"}}>
          <p className="sampleLabel">{props.sample.name} [{props.sample.duration}]</p>
          <p style={{textAlign: "center"}}>{padState === padStates.PLAYING && <VolumeUpIcon />}</p>
        </div>
      </div>
      <div style={{textAlign: "center"}}>
        <LoopIcon
          className={
            "paddedIcon" + (props.sample.type == "loop" ? " activeIcon" : "")
          }
        />
        <TuneIcon
          className={"paddedIcon" + (props.isFxPanelOpen ? " activeIcon" : "")}
          onClick={() => {
            props.openFXPanel();
          }}
        />
      </div>
    </div>
  );
}
