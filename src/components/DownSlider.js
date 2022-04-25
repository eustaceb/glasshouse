import React, {useEffect, useState, useRef} from "react";

import {uuidv4} from "../utils/GUID.js";

export function DownSlider(props) {
  // position describes continuous output to control the effect
  // step describes discrete state of the slider
  const minStep = parseInt(props.minStep);
  const maxStep = parseInt(props.maxStep);
  const minPosition = parseInt(props.minPosition);
  const maxPosition = parseInt(props.maxPosition);
  const initialPosition = parseInt(props.initialPosition);
  const initialStep = parseInt(props.initialStep);
  const className = props.className;

  const [step, setStep] = useState(initialStep);
  const [position, setPosition] = useState(initialPosition);
  const mouseDown = useRef(false);

  const componentId = useRef(uuidv4());

  const handleMouseMove = React.useCallback(
    (event) => {
      event.preventDefault();

      if (mouseDown.current) {
        let nextPosition = position + event.movementY;
        nextPosition = Math.max(
          Math.min(maxPosition, nextPosition),
          minPosition
        );

        props.callback(nextPosition);
        setPosition(nextPosition);
        setStep(Math.trunc((position / maxPosition) * maxStep));
        console.log(position);
      }
    },
    [position, step]
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

  const handleMouseDown = (_) => {
    mouseDown.current = true;
  };

  return (
    <div
      className={className + " " + className + "_" + step}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}></div>
  );
}
