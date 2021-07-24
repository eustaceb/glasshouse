import React, {useState} from "react";
import LoopIcon from "@material-ui/icons/Loop";
import TuneIcon from "@material-ui/icons/Tune";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

export function SamplePad(props) {
  const [isLooping, setLooping] = useState(true);
  const [isPlaying, setPlaying] = useState(false);

  let className = "";
  if (props.selected) {
    className += "activePad";
  }

  return (
    <div>
      <div
        style={{backgroundColor: props.sample.color, position: "relative"}}
        onClick={() => {
          props.onClick();
          setPlaying(!isPlaying);
        }}
        className="pad">
        <div style={{position: "relative"}}>
          <div className={isPlaying ? "activePadBackground" : ""} />
        </div>
        <p className="sampleLabel">{props.sample.name}</p>
        <p style={{textAlign: "center"}}>
          {props.selected && <VolumeUpIcon />}
        </p>
      </div>
      <div style={{textAlign: "center"}}>
        <LoopIcon
          onClick={() => {
            props.sample.setLoop(!isLooping);
            setLooping(!isLooping);
          }}
          className={
            "paddedIcon" + (props.sample.isLooping ? " activeIcon" : "")
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
