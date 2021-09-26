import React, {useState} from "react";
// import Button from "@material-ui/core/Button";
// import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Checkbox from "@material-ui/core/Checkbox";

function FxParamSlider(props) {
  const [value, setValue] = useState(0);
  return (
    <Grid container>
      <Grid item xs={5}>
        {props.label}
      </Grid>
      <Grid item xs={6}>
        <Slider
          aria-label={props.label}
          value={value}
          valueLabelDisplay="auto"
          getAriaValueText={(value) => value.toString() + "%"}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          onChangeCommitted={(event, newValue) => {
            props.setFxParamValue(newValue / 100.0);
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <b>{value}</b>
      </Grid>
    </Grid>
  );
}

function FXControls(props) {
  const [enabled, setEnabled] = useState(false);

  const fxParams = Object.keys(props.fxParams)
    .filter((name) => !["enabled", "type"].includes(name))
    .map((param, index) => {
      return (
        <Grid item xs={12} xl={4} key={index}>
          <FxParamSlider
            label={param}
            setFxParamValue={props.fxParams[param]}
          />
        </Grid>
      );
    });
  return (
    <Grid container>
      <Grid item xl={1} xs={6}>
        <span className="fxLabel">{props.fxName}</span>
      </Grid>
      <Grid item xl={1} xs={6}>
        <Checkbox
          checked={enabled}
          onChange={() => {
            props.fxParams["enabled"](!enabled);
            setEnabled(!enabled);
          }}
          size="small"
        />
      </Grid>
      <Grid item xl={10} xs={12}>
        <Grid container>{fxParams}</Grid>
      </Grid>
      {/*}
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
      */}
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
      <Grid item xs={12}>
        <p>Selected sample: {props.sample.name}</p>
      </Grid>
      <Grid item xs={12}>
        <FXControls
          fxParams={{
            amount: (val) =>
              props.sample.fx.setFxParam("distortion", "amount", val),
            enabled: (val) =>
              props.sample.fx.setFxParam("distortion", "enabled", val),
          }}
          fxName="Distortion"
        />
      </Grid>
      <Grid item xs={12}>
        <FXControls
          fxParams={{
            amount: (val) =>
              props.sample.fx.setFxParam("reverb", "amount", val),
            enabled: (val) =>
              props.sample.fx.setFxParam("reverb", "enabled", val),
          }}
          fxName="Reverb"
        />
      </Grid>
      <Grid item xs={12}>
        <FXControls
          fxParams={{
            amount: (val) => props.sample.fx.setFxParam("delay", "amount", val),
            enabled: (val) =>
              props.sample.fx.setFxParam("delay", "enabled", val),
          }}
          fxName="Delay"
        />
      </Grid>
      <Grid item xs={12}>
        <FXControls
          fxParams={{
            frequency: (val) =>
              props.sample.fx.setFxParam("chorus", "frequency", val),
            delayTime: (val) =>
              props.sample.fx.setFxParam("chorus", "delayTime", val),
            depth: (val) => props.sample.fx.setFxParam("chorus", "depth", val),
            enabled: (val) =>
              props.sample.fx.setFxParam("chorus", "enabled", val),
          }}
          fxName="Chorus"
        />
      </Grid>
    </Grid>
  );
}
