import React, {useState, useEffect} from "react";

import {uuidv4} from "../utils/GUID.js";
import {clamp} from "../utils/Math.js";
import {useLocalContext} from "../utils/ReactHelpers.js";

export function XYPadStyled(props) {

  const minValue = props.minValue;
  const maxValue = props.maxValue; // equivalent to squre size
  const size = props.trackerSize;
  const trackerMiddle = size / 2;

  const [x, setX] = useState(maxValue / 2);
  const [y, setY] = useState(maxValue / 2);

  const [componentId, setComponentId] = useState(uuidv4());
  const ctx = useLocalContext({x, y, componentId});

  const mouseMove = React.useCallback(
    (e) => {
      if (e.dragOrigin != null) {
        const thisElement =
          e.dragOrigin.id === componentId ||
          e.dragOrigin.parentElement?.id === componentId;
        if (e.isDragging && thisElement) {
          const rect = document
            .getElementById(componentId)
            .getBoundingClientRect();

          // Movement deltas
          const deltaX = e.clientX - rect.left - trackerMiddle;
          const deltaY = e.clientY - rect.top - trackerMiddle;

          // Apply and constrain
          const constrainedX = clamp(deltaX, minValue, maxValue);
          const constrainedY = clamp(deltaY, minValue, maxValue);

          // Only update state if value has changed
          if (Math.abs(constrainedX - ctx.x) > 0.0000001) {
            if (props.callbackX) props.callbackX(constrainedX);
            setX(constrainedX);
          }
          if (Math.abs(constrainedY - ctx.y) > 0.0000001) {
            if (props.callbackY) props.callbackY(constrainedY);
            setY(constrainedY);
          }
        }
      }
    },
    [minValue, maxValue, props.callbackX, props.callbackY]
  );

  const mouseDown = React.useCallback((e) => {
    // Check if we clicked on one of the elements in the SVG
    const thisElement =
      e.target.id === componentId || e.target.parentElement.id === componentId;
    if (thisElement) {
      const rect = document.getElementById(componentId).getBoundingClientRect();
      // Apply and constrain
      const constrainedX = clamp(e.clientX - rect.left - trackerMiddle, minValue, maxValue);
      const constrainedY = clamp(e.clientY - rect.top - trackerMiddle, minValue, maxValue);
      setX(constrainedX);
      setY(constrainedY);
      if (ctx.callbackX) ctx.callbackX(constrainedX);
      if (ctx.callbackY) ctx.callbackY(constrainedY);
    }
  });

  useEffect(() => {
    setX(maxValue / 2);
    setY(maxValue / 2);

    props.mouseController.registerListener(componentId, "mouseDown", mouseDown);
    props.mouseController.registerListener(componentId, "mouseMove", mouseMove);

    return () => {
      props.mouseController.removeListener(componentId, "mouseDown");
      props.mouseController.removeListener(componentId, "mouseMove");
    };
  }, [props.fx, props.mouseController]);


  return (
    <div className={props.boxClassName} id={componentId}>
      <div className={props.trackerClassName} style = {{top: y, left: x}}></div>
    </div>
  );
}
