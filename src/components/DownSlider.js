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

  const [position, setPosition] = useState(props.initialPosition);
  const mouseDown = useRef(false);

  const componentId = useRef(uuidv4());

  const positionToStep = (pos, steps) => {
    return Math.trunc((pos / maxPosition) * steps);
  }

  function transformPosition(position)
  {
    return Math.log10(0.5 * position + 0.07) + 1.2;
  }

  const handleMouseMove = React.useCallback(
    (event) => {
      event.preventDefault();
      if (mouseDown.current) {
        const hitBox = event.target.getBoundingClientRect();

        // Next position is a proportion of cursorY / element height (so [0,1])
        let nextPosition = (event.clientY - hitBox.top) / hitBox.height;
        nextPosition = clamp(nextPosition, minPosition, maxPosition);
        nextPosition = transformPosition(nextPosition)

        props.callback(nextPosition);
        setPosition(nextPosition);
      }
    },
    [position]
  );

  useEffect(() => {
    let componentRef = componentId.current;

    setPosition(transformPosition(props.initialPosition));
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
    },
    [position]
  );

  return (
    <div
      className={"nonselectable " + className + " " + className + "_" + positionToStep(position, steps)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}></div>
  );
}
