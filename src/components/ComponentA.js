import React, {useState, useEffect} from "react";
import {DownSlider} from "./DownSlider.js";
import {InstrumentGroup} from "./InstrumentGroup.js";
import {MultistateSwitch} from "./MultistateSwitch.js";

export function ComponentA(props) {
  const wetControl = props.group.getFxControls()["wet"];
  const switchControl = props.group.getFxControls()["switch"];
  let fxComponent;
  let fxAppendageComponent = null;

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
      {fxAppendageComponent !== null ? fxAppendageComponent : null}
    </div>
  );
}
