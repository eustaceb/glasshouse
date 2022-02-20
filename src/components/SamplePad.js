import React, {useState} from "react";
import LoopIcon from "@material-ui/icons/Loop";
import TuneIcon from "@material-ui/icons/Tune";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

export function SamplePad(props) {
  const playStates = props.sample.playStates;

  // Rerender this component every bar
  const [playState, setPlayState] = useState(playStates.INACTIVE);
  const isPlaying = props.sample.getPlayState() === playStates.PLAYING;
  const isScheduled = props.sample.getPlayState() === playStates.SCHEDULED;

  const triggerSample = () => {
    if (!props.sample.isActive()) {
      // Register end playback callback that will rerender this UI if not looping
      props.sample.setEndPlaybackCallback(() => setPlayState(playStates.INACTIVE));
      props.sample.setStartPlaybackCallback(() => setPlayState(playStates.PLAYING));
      props.playSample();
      setPlayState(playStates.SCHEDULED);
    } else if (props.sample.getPlayState() == playStates.PLAYING) {
      props.stopSample();
    }
  };

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
          <p className="sampleLabel">{props.sample.name}{ isScheduled ? "..." : ""}</p>
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
