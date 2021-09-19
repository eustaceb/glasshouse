import * as Tone from "tone";
import React, {useState, useRef} from "react";
import LoopIcon from "@material-ui/icons/Loop";
import TuneIcon from "@material-ui/icons/Tune";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

export function SamplePad(props) {
  // Rerender this component every bar

  const [isPlaying, setPlaying] = useState(false);
  const isToneStarted = useRef(false);

  const triggerSample = () => {
    // if (!isToneStarted.current) {
    //   Tone.Transport.debug = true;
    //   isToneStarted.current = true;
    // }
    if (!props.sample.isPlaying()) {
      props.playSample();
    } else {
      props.stopSample();
      // Register end playback callback that will rerender this UI if not looping
      props.sample.setEndPlaybackCallback(() => setPlaying(false));
    }
    setPlaying(!isPlaying);
  }

  return (
    <div>
      <div
        style={{backgroundColor: props.sample.color, position: "relative"}}
        onClick={() => triggerSample()}
        className="pad">
        <div style={{position: "relative"}}>
          <div className={isPlaying ? "beatStrip" : ""} />
        </div>
        <div style={{padding: "1%"}}>
          <p className="sampleLabel">{props.sample.name}</p>
          <p style={{textAlign: "center"}}>{isPlaying && <VolumeUpIcon />}</p>
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
