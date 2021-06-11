import React from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";

export function PlaybackControls(props) {
  return (
    <div style={{textAlign: "center"}}>
      <PlayArrowIcon fontSize="large" onClick={() => props.start()} />
      <StopIcon fontSize="large" onClick={() => props.stop()} />
    </div>
  );
}
