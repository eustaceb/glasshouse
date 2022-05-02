import React, {useEffect, useState, useRef} from "react";

import {uuidv4} from "../utils/GUID.js";
import {clamp} from "../utils/Math.js";

export function DiscreteSlider(props) {
  const steps = props.steps;
  const className = props.className;

  const [step, setStep] = useState(props.initialStep);
  const mouseDown = useRef(false);

  const componentId = useRef(uuidv4());

  const handleMouseMove = React.useCallback(
    (event) => {
      event.preventDefault();
      if (mouseDown.current) {
        const hitBox = event.target.getBoundingClientRect();

        // Next position is a proportion of cursorY / element height (so [0,1])
        let nextPosition = (event.clientY - hitBox.top) / hitBox.height;
        const nextStep = Math.round(nextPosition * (steps - 1));
        props.callback(nextStep);
        setStep(nextStep);
      }
    },
    [step]
  );

  useEffect(() => {
    let componentRef = componentId.current;
    props.mouseController.registerListener(
      componentId.current,
      "mouseUp",
      () => {
        mouseDown.current = false;
      }
    );

    setStep(props.initialStep);

    return () => {
      props.mouseController.removeListener(componentRef, "mouseUp");
    };
  }, [componentId, props.callback, props.mouseController]);

  const handleMouseDown = React.useCallback(
    (event) => {
      event.preventDefault();

      mouseDown.current = true;
      const hitBox = event.target.getBoundingClientRect();

      // Next position is a proportion of cursorY / element height (so [0,1])
      let nextPosition = (event.clientY - hitBox.top) / hitBox.height;
      const nextStep = Math.round(nextPosition * (steps - 1));
      // No need to clamp - click is always within hit box
      props.callback(nextStep);
      setStep(nextStep);
    },
    [step]
  );

  return (
    <div
      className={className + " " + className + "_" + (step + 1) + " nonselectable"}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}></div>
  );
}
