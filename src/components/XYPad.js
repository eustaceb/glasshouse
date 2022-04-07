import React, {useState, useEffect, useRef} from "react";
import {useLocalContext} from "../utils/ReactHelpers.js";
import {uuidv4} from "../utils/GUID.js";

export function XYPad(props) {
  const size = props.size;
  const center = size / 2;
  const [x, setX] = useState(center);
  const [y, setY] = useState(center);

  const [componentId, setComponentId] = useState(uuidv4());

  const trackMouse = useRef(false);
  const callbackX = props.callbackX;
  const callbackY = props.callbackY;
  const ctx = useLocalContext({callbackX, callbackY, x, y});

  const minValueX = props.minValueX ? props.minValueX : 0;
  const maxValueX = props.maxValueX ? props.maxValueX : 100;
  const minValueY = props.minValueY ? props.minValueY : 0;
  const maxValueY = props.maxValueY ? props.maxValueY : 100;

  const mouseMove = React.useCallback(
    (event) => {
      if (trackMouse.current && event.isDragging) {
        //const domElement = event.target;
        const rect = event.rect; //domElement.getBoundingClientRect();

        // Movement deltas
        const deltaX = event.clientX - rect.left;
        const deltaY = event.clientY - rect.top;
        // Apply and constrain
        const constrainedX = Math.min(maxValueX, Math.max(minValueX, deltaX));
        const constrainedY = Math.min(maxValueY, Math.max(minValueY, deltaY));

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
    },
    [minValueX, maxValueX, minValueY, maxValueY]
  );

  const mouseDown = React.useCallback((e) => {
    //const domElement = document.getElementById(componentId);
    const rect = e.rect; //domElement.getBoundingClientRect();
    if (trackMouse.current /*&& domElement.contains(e.target)*/) {
      // Apply and constrain
      const constrainedX = Math.min(
        maxValueX,
        Math.max(minValueX, e.clientX - rect.left)
      );
      const constrainedY = Math.min(
        maxValueY,
        Math.max(minValueY, e.clientY - rect.top)
      );
      setX(constrainedX);
      setY(constrainedY);
      if (ctx.callbackX) ctx.callbackX(constrainedX);
      if (ctx.callbackY) ctx.callbackY(constrainedY);
    }
  });

  useEffect(() => {
    setComponentId(uuidv4());

    props.mouseController.registerListener(componentId, "mouseDown", mouseDown);
    props.mouseController.registerListener(componentId, "mouseMove", mouseMove);
    props.mouseController.registerListener(componentId, "mouseUp", () => {
      trackMouse.current = false;
    });
    props.mouseController.registerListener(componentId, "mouseLeave", () => {
      trackMouse.current = false;
    });

    return () => {
      props.mouseController.removeListener(componentId, "mouseDown");
      props.mouseController.removeListener(componentId, "mouseMove");
      props.mouseController.removeListener(componentId, "mouseUp");
      props.mouseController.removeListener(componentId, "mouseLeave");
    };
  }, [
    props.fx,
    props.mouseController
  ]);

  return (
    <div className="centered">
      <p className="nonselectable">{props.label}</p>
      <svg
        id={props.fx.type}
        onMouseDown={(e) => {
          trackMouse.current = true;
        }}
        width={size}
        height={size}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        <rect width={size} height={size} fill="yellow" stroke="black" />
        <circle cx={x} cy={y} r={5} fill="yellow" stroke="black" />
      </svg>
      <div className="nonselectable">
        {props.fx.xAxis.paramName}: {Math.round(x).toString().padStart(3, "0")}{" "}
        / {maxValueX}
      </div>
      <div className="nonselectable">
        {props.fx.yAxis.paramName}: {Math.round(y).toString().padStart(3, "0")}{" "}
        / {maxValueY}
      </div>
    </div>
  );
}
