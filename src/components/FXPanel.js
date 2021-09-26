import React, {useState} from "react";
// import Button from "@material-ui/core/Button";
// import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Checkbox from "@material-ui/core/Checkbox";

function FxParamSlider(props) {
  const [value, setValue] = useState(props.param.value);
  const [rerender, setRerender] = useState(false);

  const round = (val, digits) =>
    Math.round((val + Number.EPSILON) * Math.round(Math.pow(10, digits))) /
    Math.round(Math.pow(10, digits));
  const valueStep = round((props.param.max - props.param.min) / 100, 2);

  return (
    <Grid container>
      <Grid item xs={5}>
        {props.param.displayName}
      </Grid>
      <Grid item xs={6}>
        <Slider
          aria-label={props.param.displayName}
          value={value}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => round(val / ((props.param.max - props.param.min) / 100), 2).toString()}
          getAriaValueText={(value) => value.toString()}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          onChangeCommitted={(event, newValue) => {
            props.setFxParamValue(newValue);
            setRerender(!rerender);
          }}
          min={props.param.min}
          max={props.param.max}
          step={valueStep}
          scale={(val) => val * valueStep}
        />
      </Grid>
      <Grid item xs={1}>
        <b>{round(props.param.value, 2)}</b>
      </Grid>
    </Grid>
  );
}

function FXControls(props) {
  const [enabled, setEnabled] = useState(false);

  const fxParams = Object.keys(props.effect.params)
    .filter((name) => !["enabled", "type"].includes(name))
    .map((param, index) => {
      return (
        <Grid item xs={12} xl={4} key={index}>
          <FxParamSlider
            setFxParamValue={(val) =>
              props.setFxParam(props.effect.name, param, val)
            }
            param={props.effect.params[param]}
          />
        </Grid>
      );
    });
  return (
    <Grid container>
      <Grid item xl={1} xs={6}>
        <span className="fxLabel">{props.effect.displayName}</span>
      </Grid>
      <Grid item xl={1} xs={6}>
        <Checkbox
          checked={enabled}
          onChange={() => {
            props.setFxParam(props.effect.name, "enabled", !enabled);
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
  const effectControls = Object.keys(props.effects).map((effect, index) => {
    return (
      <Grid item xs={12} key={index}>
        <FXControls
          effect={props.effects[effect]}
          setFxParam={props.setFxParam}
        />
      </Grid>
    );
  });

  return (
    <Grid
      container
      item
      xs={12}
      justifyContent="center"
      style={{
        backgroundColor: props.panelColor,
      }}
      className="fxPanelContainer">
      {effectControls}
    </Grid>
  );
}
