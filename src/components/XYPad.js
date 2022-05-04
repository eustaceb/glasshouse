import React, {useState, useEffect} from "react";

import {uuidv4} from "../utils/GUID.js";
import {clamp} from "../utils/Math.js";
import {useLocalContext} from "../utils/ReactHelpers.js";

export function XYPad(props) {
  const size = props.size;
  const center = size / 2;
  const [x, setX] = useState(center);
  const [y, setY] = useState(center);

  const [componentId, setComponentId] = useState(uuidv4());

  const callbackX = props.callbackX;
  const callbackY = props.callbackY;
  const ctx = useLocalContext({callbackX, callbackY, x, y, componentId});

  const minValue = 0;
  const maxValue = 100;

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
          const deltaX = e.clientX - rect.left;
          const deltaY = e.clientY - rect.top;

          // Apply and constrain
          const constrainedX = clamp(deltaX, minValue, maxValue);
          const constrainedY = clamp(deltaY, minValue, maxValue);

          // Only update state if value has changed
          if (Math.abs(constrainedX - ctx.x) > 0.0000001) {
            if (ctx.callbackX) ctx.callbackX(constrainedX);
            setX(constrainedX);
          }
          if (Math.abs(constrainedY - ctx.y) > 0.0000001) {
            if (ctx.callbackY) ctx.callbackY(constrainedY);
            setY(constrainedY);
          }
        }
      }
    },
    [minValue, maxValue]
  );

  const mouseDown = React.useCallback((e) => {
    // Check if we clicked on one of the elements in the SVG
    const thisElement =
      e.target.id === componentId ||
      (e.target.parentElement && e.target.parentElement.id === componentId);
    if (thisElement) {
      const rect = document.getElementById(componentId).getBoundingClientRect();
      // Apply and constrain
      const constrainedX = clamp(e.clientX - rect.left, minValue, maxValue);
      const constrainedY = clamp(e.clientY - rect.top, minValue, maxValue);
      setX(constrainedX);
      setY(constrainedY);
      if (ctx.callbackX) ctx.callbackX(constrainedX);
      if (ctx.callbackY) ctx.callbackY(constrainedY);
    }
  });

  useEffect(() => {
    setX(center);
    setY(center);

    props.mouseController.registerListener(componentId, "mouseDown", mouseDown);
    props.mouseController.registerListener(componentId, "mouseMove", mouseMove);

    return () => {
      props.mouseController.removeListener(componentId, "mouseDown");
      props.mouseController.removeListener(componentId, "mouseMove");
    };
  }, [props.fx, props.mouseController]);

  return (
    <div className="centered">
      <p className="nonselectable">{props.label}</p>
      <svg
        id={componentId}
        width={size}
        height={size}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        <rect width={size} height={size} fill="yellow" stroke="black" />
        <circle cx={x} cy={y} r={5} fill="yellow" stroke="black" />
      </svg>
      <div className="nonselectable">
        {props.fx.getLabelX()}: {Math.round(x).toString().padStart(3, "0")} /{" "}
        {maxValue}
      </div>
      <div className="nonselectable">
        {props.fx.getLabelY()}: {Math.round(y).toString().padStart(3, "0")} /{" "}
        {maxValue}
      </div>
    </div>
  );
}
