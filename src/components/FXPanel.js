import React, {useState} from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import {KnobControl} from "./KnobControl.js";

function LabeledCheckbox(props) {
  const checkbox = <Checkbox onChange={props.onChange} />;
  return <FormControlLabel control={checkbox} label={props.label} />;
}

export function FXPanel(props) {
  const [distortionEnabled, enableDistortion] = useState(false);
  const [distortionAmount, setDistortionAmount] = useState(0.0);

  return (
    <Grid
      container
      item
      xs={12}
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundColor: props.sample.color,
      }}
      className="fxPanelContainer">
      <Grid container item xs={12} justifyContent="center" alignItems="center">
        <p>Selected sample: {props.sample.name}</p>
      </Grid>
      <Grid item xs={12}>
        <div style={{textAlign: "center"}}>
          <KnobControl
            label="Distortion Amount"
            size={50}
            mouseController={props.mouseController}
            callback={(val) => {
              props.sample.fx.setDistortionAmount(val / 100.0);
              setDistortionAmount(val / 100.0);
            }}
          />
          <LabeledCheckbox
            label="Enable Distortion"
            onChange={(e) => {
              props.sample.fx.enableDistortion(e.target.checked);
              enableDistortion(e.target.checked);
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
}
