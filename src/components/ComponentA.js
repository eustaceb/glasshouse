import React, {useState, useEffect} from "react";
import {DownSlider} from "./DownSlider.js";
import {InstrumentGroup} from "./InstrumentGroup.js";
import {MultistateSwitch} from "./MultistateSwitch.js";
import {XYPadStyled} from "./XYPadStyled.js"

export function ComponentA(props) {
  const wetControl = props.group.getFxControls()["wet"];
  const xyControl = props.group.getFxControls()["xy"];
  const switchControl = props.group.getFxControls()["switch"];
  let fxComponent;
  let fxXYComponent;
  let fxAppendageComponent = null;

  if (xyControl) {
    fxXYComponent = (
      <XYPadStyled
        description={props.description.getXYPadDescription()}
        callback={(val) => wetControl.setWet(val / 100)}
        mouseController={props.mouseController}
      />
    );
  }
  if (wetControl) {
    fxComponent = (
      <DownSlider
        description={props.description.getDownSliderDescription()}
        className={props.downSliderClass}
        callback={(val) => wetControl.setWet(val / 100)}
        mouseController={props.mouseController}
      />
    );
  }
  if (switchControl) {
    fxAppendageComponent = (
      <MultistateSwitch
        initialSelection={0}
        optionLabels={switchControl.getValues().map((v) => v.toString())}
        optionCallback={(v) => switchControl.setValue(switchControl.getValues()[v])}
      />
    );
  }

  return (
    <div className={props.description.getClassName()}>
      <InstrumentGroup
        playSample={props.playSample}
        stopSample={props.stopSample}
        group={props.group}
      />
      {fxComponent}
      {fxXYComponent}
      {fxAppendageComponent !== null ? fxAppendageComponent : null}
    </div>
  );
}
