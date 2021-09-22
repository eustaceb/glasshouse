import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";

function FXControls(props) {
  const [fxLevel, setFxLevel] = useState(0);
  return (
    <Grid container>
      <Grid item xs={1}>
        <span className="fxLabel">{props.fxName}</span>
      </Grid>
      <Grid item xs={6}>
        <ButtonGroup style={{marginLeft: "5px"}}>
          <Button
            variant="contained"
            color={fxLevel == 0 ? "secondary" : "primary"}
            onClick={(e) => {
              props.setFxAmount(0);
              setFxLevel(0);
            }}>
            Off
          </Button>
          <Button
            variant="contained"
            color={fxLevel == 1 ? "secondary" : "primary"}
            onClick={(e) => {
              props.setFxAmount(0.25);
              setFxLevel(25);
            }}>
            Low
          </Button>
          <Button
            variant="contained"
            color={fxLevel == 2 ? "secondary" : "primary"}
            onClick={(e) => {
              props.setFxAmount(0.5);
              setFxLevel(50);
            }}>
            Medium
          </Button>
          <Button
            variant="contained"
            color={fxLevel == 3 ? "secondary" : "primary"}
            onClick={(e) => {
              props.setFxAmount(0.75);
              setFxLevel(75);
            }}>
            High
          </Button>
          <Button
            variant="contained"
            color={fxLevel == 4 ? "secondary" : "primary"}
            onClick={(e) => {
              props.setFxAmount(1.0);
              setFxLevel(100);
            }}>
            Bit too much
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={4}>
        <Slider
          aria-label="Amount"
          value={fxLevel}
          valueLabelDisplay="auto"
          getAriaValueText={(value) => value.toString() + "%"}
          onChange={(event, newValue) => {
            setFxLevel(newValue);
            props.setFxAmount(newValue / 100.0);
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <b>{fxLevel}</b>
      </Grid>
    </Grid>
  );
}

export function FXPanel(props) {
  return (
    <Grid
      container
      item
      xs={12}
      justifyContent="center"
      style={{
        backgroundColor: props.sample.color,
      }}
      className="fxPanelContainer">
      <Grid container item xs={12} justifyContent="center" alignItems="center">
        <p>Selected sample: {props.sample.name}</p>
      </Grid>
      <Grid item xs={12}>
        <FXControls
          setFxAmount={(val) => props.sample.fx.setDistortionAmount(val)}
          fxName="Distortion"
        />
      </Grid>
      <Grid item xs={12}>
        <FXControls
          setFxAmount={(val) => props.sample.fx.setReverbAmount(val)}
          fxName="Reverb"
        />
      </Grid>
      <Grid item xs={12}>
        <FXControls
          setFxAmount={(val) => props.sample.fx.setDelayAmount(val)}
          fxName="Delay"
        />
      </Grid>
    </Grid>
  );
}
