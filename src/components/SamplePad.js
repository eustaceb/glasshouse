import React, {useState} from "react";
import LoopIcon from "@material-ui/icons/Loop";
import TuneIcon from "@material-ui/icons/Tune";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

export function SamplePad(props) {
  const [isLooping, setLooping] = useState(true);
  const [isPlaying, setPlaying] = useState(false);

  return (
    <div>
      <div
        style={{backgroundColor: props.sample.color, position: "relative"}}
        onClick={() => {
          props.playSample();
          setPlaying(!isPlaying);
        }}
        className="pad">
        <div style={{position: "relative"}}>
          <div className={isPlaying ? "beatStrip" : ""} />
        </div>
        <div style={{padding: "1%"}}>
          <p className="sampleLabel">{props.sample.name}</p>
          <p style={{textAlign: "center"}}>
            {isPlaying && <VolumeUpIcon />}
          </p>
        </div>
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
