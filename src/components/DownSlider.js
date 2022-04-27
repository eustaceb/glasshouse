import React, {useEffect, useState, useRef} from "react";

import {uuidv4} from "../utils/GUID.js";
import {clamp} from "../utils/Math.js";

export function DownSlider(props) {
  // position describes continuous output to control the effect
  // step describes discrete state of the slider
  const steps = props.steps;
  const minPosition = props.minPosition;
  const maxPosition = props.maxPosition;
  const className = props.className;

  const [step, setStep] = useState(props.initialStep);
  const [position, setPosition] = useState(props.initialPosition);
  const mouseDown = useRef(false);

  const componentId = useRef(uuidv4());

  const handleMouseMove = React.useCallback(
    (event) => {
      event.preventDefault();
      if (mouseDown.current) {
        const hitBox = event.target.getBoundingClientRect();

        // Next position is a proportion of cursorY / element height (so [0,1])
        let nextPosition = (event.clientY - hitBox.top) / hitBox.height;
        nextPosition = clamp(nextPosition, minPosition, maxPosition);

        props.callback(nextPosition);
        setPosition(nextPosition);
        setStep(Math.trunc((nextPosition / maxPosition) * steps));
      }
    },
    [position]
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
      // No need to clamp - click is always within hit box

      props.callback(nextPosition);
      setPosition(nextPosition);
      setStep(Math.trunc((nextPosition / maxPosition) * steps));
    },
    [position]
  );

  return (
    <div
      className={className + " " + className + "_" + step}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}></div>
  );
}
