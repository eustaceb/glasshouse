import React, {useState} from "react";
import {Slider} from "@material-ui/core";

export function VolumeSlider(props) {
  const [volume, setVolume] = useState(props.volume.getParam("volume"));
  const handleChange = (_, newValue) => {
    props.volume.setParam("volume", newValue);
    setVolume(newValue);
  };
  return (
    <div>
      <Slider
        style={{width: "100px"}}
        value={props.volume.getParam("volume")}
        aria-label="Volume"
        onChange={handleChange}
        min={-50}
        step={1}
        max={50}
      />
      <p>Volume: {volume}db</p>
    </div>
  );
}
