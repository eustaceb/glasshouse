import React, {useEffect, useState, useRef} from "react";

import {uuidv4} from "../utils/GUID.js";
import {clamp} from "../utils/Math.js";

export function DownSlider(props) {
  // position describes continuous output to control the effect
  // step describes discrete state of the slider
  const minStep = parseInt(props.description.getMinStep());
  const maxStep = parseInt(props.description.getMaxStep());
  const minPosition = parseInt(props.description.getMinPosition());
  const maxPosition = parseInt(props.description.getMaxPosition());
  const initialPosition = parseInt(props.description.getInitialPosition());
  const initialStep = parseInt(props.description.getInitialStep());
  const className = props.description.getClassName();

  const [step, setStep] = useState(initialStep);
  const [position, setPosition] = useState(initialPosition);
  const mouseDown = useRef(false);

  const componentId = useRef(uuidv4());

  const handleMouseMove = React.useCallback(
    (event) => {
      event.preventDefault();

      if (mouseDown.current) {
        let nextPosition = position + event.movementY;
        nextPosition = clamp(nextPosition, minPosition, maxPosition);

        props.callback(nextPosition);
        setPosition(nextPosition);
        setStep(Math.trunc((nextPosition / maxPosition) * maxStep));
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
      mouseDown.current = true;
      const hitBox = event.target.getBoundingClientRect();
      let nextPosition = Math.round(
        (100 * (event.clientY - hitBox.top)) / hitBox.height
      );
      nextPosition = clamp(nextPosition, minPosition, maxPosition);
      props.callback(nextPosition);
      setPosition(nextPosition);
      setStep(Math.trunc((nextPosition / maxPosition) * maxStep));
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
