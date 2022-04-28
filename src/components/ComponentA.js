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
  let fxAppendageComponent;

  if (xyControl) {
    const desc = props.description.getXYPadDescription();
    fxXYComponent = (
      <XYPadStyled
        minValue={0}
        maxValue={123}
        trackerSize={57}
        boxClassName={desc.getBoxClassName()}
        trackerClassName={desc.getTrackerClassName()}
        callback={(val) => wetControl.setWet(val)}
        mouseController={props.mouseController}
      />
    );
  }
  if (wetControl) {
    const desc = props.description.getDownSliderDescription();
    fxComponent = (
      <DownSlider
        className={desc.getClassName()}
        minStep={0}
        steps={desc.getSteps()}
        minPosition={0}
        maxPosition={1}
        initialPosition={wetControl.getWet()}
        callback={(val) => wetControl.setWet(val)}
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
    <div className={"componentContainer"}>
    <div className={props.description.getClassName()}>
      <InstrumentGroup
        playSample={props.playSample}
        stopSample={props.stopSample}
        group={props.group}
      />
      {fxComponent}
      {fxXYComponent}
    </div>
    {fxAppendageComponent}
    </div>
  );
}
