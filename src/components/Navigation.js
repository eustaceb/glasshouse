import React, {useState} from "react";
import * as Tone from "tone";
import {LayeredButton} from "./LayeredButton.js";

export function Navigation(props) {
  const sectionIndex = props.sectionIndex;
  const [muted, setMuted] = useState(false);

  const mute = () => {
    Tone.getDestination().mute = !Tone.getDestination().mute;
    setMuted(!muted);
  };

  return (
    <div className="navigation">
      {sectionIndex > 0 ? (
        <div
          className="navigationArrow navigationArrowLeft"
          onClick={() => props.setSection(sectionIndex - 1)}
        />
      ) : (
        <div className="navigationMarker navigationMarkerLeft" />
      )}
      <div className="navigationRepeat" />
      <LayeredButton cssName={"muteButton navigationMute"} callback={mute} />
      <div className="navigationRepeat" />
      {sectionIndex < props.sectionCount - 1 ? (
        <div
          className="navigationArrow navigationArrowRight"
          onClick={() => props.setSection(sectionIndex + 1)}
        />
      ) : (
        <div className="navigationMarker navigationMarkerRight" />
      )}
    </div>
  );
}
