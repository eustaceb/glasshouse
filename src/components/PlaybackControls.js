import React from "react";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";

export function PlaybackControls(props) {
  return (
    <div style={{textAlign: "center"}}>
      <PlayArrowIcon
        fontSize="large"
        style={{cursor: "pointer"}}
        onClick={() => props.start()}
      />
      <StopIcon
        fontSize="large"
        style={{cursor: "pointer"}}
        onClick={() => props.stop()}
      />
    </div>
  );
}
