import React, {useState, useEffect, useRef} from "react";
import {uuidv4} from "../utils/GUID.js";

export function XYPad(props) {
  //const xyRef = useRef({x: props.x, y: props.y});
  const size = props.size;
  const center = props.size / 2;
  const [x, setX] = useState(center);
  const [y, setY] = useState(center);

  const componentId = useRef(uuidv4());
  const trackMouse = useRef(false);
  const callbackX = useRef();
  const callbackY = useRef();

  const minValueX = props.minValueX ? props.minValueX : 0;
  const maxValueX = props.maxValueX ? props.maxValueX : 100;
  const minValueY = props.minValueY ? props.minValueY : 0;
  const maxValueY = props.maxValueY ? props.maxValueY : 100;
  const dragWeight = 100;

  const mouseMove = React.useCallback(
    (event) => {
      event.preventDefault();
      if (trackMouse.current && event.isDragging) {
        // Movement deltas
        const deltaX =
          ((event.clientX - event.dragStart[0]) / window.innerWidth) *
          dragWeight;
        const deltaY =
          ((event.clientY - event.dragStart[1]) / window.innerHeight) *
          dragWeight;

        // Apply and constrain
        const constrainedX = Math.min(
          maxValueX,
          Math.max(minValueX, x + deltaX)
        );
        const constrainedY = Math.min(
            maxValueY,
            Math.max(minValueY, y + deltaY)
          );
        
        // Only update state if value has changed
        if (Math.abs(constrainedX - x) > 0.0000001) {
          if (callbackX.current) callbackX.current(constrainedX);
          setX(constrainedX);
        }
        if (Math.abs(constrainedY - y) > 0.0000001) {
            if (callbackY.current) callbackY.current(constrainedY);
            setY(constrainedY);
          }
      }
    },
    [minValueX, maxValueX, minValueY, maxValueY]
  );

  useEffect(() => {
    let componentRef = componentId.current;

    props.mouseController.registerListener(
      componentId.current,
      "mouseMove",
      mouseMove
    );
    props.mouseController.registerListener(
      componentId.current,
      "mouseUp",
      () => {
        trackMouse.current = false;
      }
    );
    props.mouseController.registerListener(
      componentId.current,
      "mouseLeave",
      () => {
        trackMouse.current = false;
      }
    );
    callbackX.current = props.callbackX;
    callbackY.current = props.callbackY;

    return () => {
      props.mouseController.removeListener(componentRef, "mouseMove");
      props.mouseController.removeListener(componentRef, "mouseUp");
      props.mouseController.removeListener(componentRef, "mouseLeave");
    };
  }, [componentId, mouseMove, props.callbackX, props.callbackY, props.mouseController]);

  return (
    <div className="centered">
      <p className="nonselectable">{props.label}</p>
      <svg
        onMouseDown={(e) => {
          trackMouse.current = true;
        }}
        width={size}
        height={size}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        <rect width={size} height={size} fill="yellow" stroke="black" />
        <circle cx={x} cy={y} r={5} fill="yellow" stroke="black" />
        {/* <line
          x1={center}
          y1={center}
          x2={x2}
          y2={y2}
          stroke="lightgrey"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          stroke="black"
          strokeWidth={strokeWidth}
          fillOpacity="0"
        /> */}
      </svg>
      <div className="nonselectable">
        X: {Math.round(x).toString().padStart(3, "0")} / {maxValueX}
      </div>
      <div className="nonselectable">
        Y: {Math.round(y).toString().padStart(3, "0")} / {maxValueY}
      </div>
    </div>
  );
}
