import React, {useState} from "react";
import {Slider} from "@material-ui/core";

export function DiscreteSlider(props) {
  // props:
  // - initialValue
  // - callback
  // - marks
  const [value, setValue] = useState(props.initialValue);
  const handleChange = (_, newValue) => {
    props.callback(newValue);
    setValue(newValue);
  };
  return (
    <Slider
      style={{width: "100px"}}
      min={props.marks[0].value}
      max={props.marks[props.marks.length - 1].value}
      value={value}
      aria-label="Volume"
      onChange={handleChange}
      step={null}
      valueLabelDisplay="auto"
      marks={props.marks}
    />
  );
}
