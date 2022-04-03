import React, {useState, useEffect, useRef} from "react";
import {uuidv4} from "../utils/GUID.js";

export function KnobControl(props) {
  const [value, setValue] = useState(0);
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  });

  const componentId = useRef(uuidv4());
  const trackMouse = useRef(false);
  const callback = useRef();

  const strokeWidth = 2;
  const center = props.size / 2;
  const r = props.size - center - strokeWidth * 2;
  const minValue = props.minValue ? props.minValue : 0;
  const maxValue = props.maxValue ? props.maxValue : 100;
  const dragWeight = 400;

  const rads = -Math.PI * (3 / 2) + value * 1.8 * ((2 * Math.PI) / 180);
  console.log(rads);
  const y2 = center + Math.sin(rads) * r;
  const x2 = center + Math.cos(rads) * r;

  const mouseMove = React.useCallback(
    (event) => {
      event.preventDefault();
      if (trackMouse.current && event.isDragging) {
        const delta =
          ((event.clientX - event.dragStart[0]) / window.innerWidth) *
          dragWeight;
        const constrained = Math.min(maxValue, Math.max(minValue, delta));

        // Only update state if value has changed
        if (Math.abs(constrained - valueRef.current) > 0.0000001) {
          if (callback.current) callback.current(constrained);
          setValue(constrained);
        }
      }
    },
    [maxValue, minValue]
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
    callback.current = props.callback;

    return () => {
      props.mouseController.removeListener(componentRef, "mouseMove");
      props.mouseController.removeListener(componentRef, "mouseUp");
      props.mouseController.removeListener(componentRef, "mouseLeave");
    };
  }, [componentId, mouseMove, props.callback, props.mouseController]);

  return (
    <div className="centered">
      <p className="nonselectable">{props.label}</p>
      <svg
        onMouseDown={(e) => {
          trackMouse.current = true;
        }}
        width={props.size}
        height={props.size}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx={center} cy={center} r={r} fill="blueviolet" />
        <line
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
        />
      </svg>
      <p className="nonselectable">
        {Math.round(value)} / {maxValue}
      </p>
    </div>
  );
}
