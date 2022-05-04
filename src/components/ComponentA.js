import React from "react";

import {DiscreteSlider} from "./DiscreteSlider.js";
import {DownSlider} from "./DownSlider.js";
import {InstrumentGroup} from "./InstrumentGroup.js";
import {MultistateSwitch} from "./MultistateSwitch.js";
import {XYPadStyled} from "./XYPadStyled.js";

export function ComponentA(props) {
  const sliderControl = props.group.getFxControls()["slider"];
  const xyControl = props.group.getFxControls()["xy"];
  const switchControl = props.group.getFxControls()["switch"];
  let fxComponent;
  let fxXYComponent;
  let fxAppendageComponent;

  if (xyControl) {
    const desc = props.description.getXYPadDescription();
    fxXYComponent = (
      <XYPadStyled
        boxClassName={desc.getBoxClassName()}
        trackerClassName={desc.getTrackerClassName()}
        callbackX={(val) => xyControl.setX(val)}
        callbackY={(val) => xyControl.setY(val)}
        mouseController={props.mouseController}
      />
    );
  }
  if (sliderControl) {
    const desc = props.description.getDownSliderDescription();
    if (sliderControl.isContinuous()) {
      fxComponent = (
        <DownSlider
          className={desc.getClassName()}
          steps={desc.getSteps()}
          minPosition={0}
          maxPosition={1}
          initialPosition={sliderControl.getValue()}
          callback={(val) => sliderControl.setValue(val)}
          mouseController={props.mouseController}
        />
      );
    } else {
      fxComponent = (
        <DiscreteSlider
          className={desc.getClassName()}
          steps={desc.getSteps()}
          initialStep={sliderControl.getStep()}
          callback={(step) => sliderControl.setStep(step)}
          mouseController={props.mouseController}
        />
      );
    }
  }
  if (switchControl) {
    fxAppendageComponent = (
      <MultistateSwitch
        initialSelection={0}
        optionLabels={switchControl.getValues().map((v) => v.toString())}
        optionCallback={(v) =>
          switchControl.setValue(switchControl.getValues()[v])
        }
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
        {fxXYComponent}
        {fxComponent}
      </div>
      {fxAppendageComponent}
    </div>
  );
}
