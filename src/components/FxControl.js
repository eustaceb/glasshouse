import React from "react";
import {KnobControl} from "./KnobControl.js";

export function FxControl(props) {
  const fx = props.fx;
  const mouseController = props.mouseController;
  const label = props.label;
  return (
    <KnobControl
      callback={(value) => (fx.wet = value)}
      mouseController={mouseController}
      size={50}
      label={label}
      minValue={0}
      maxValue={100}
    />
  );
}
