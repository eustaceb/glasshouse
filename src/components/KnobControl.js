import React, {useState, useEffect, useRef} from "react";
import {uuidv4} from "../utils/GUID.js";

export function KnobControl(props) {
  const strokeWidth = 2;
  const center = props.size / 2;
  const r = props.size - center - strokeWidth * 2;

  const [value, setValue] = useState(0);
  const componentId = useRef(uuidv4());
  const trackMouse = useRef(false);

  const mouseMove = function (event) {
    event.preventDefault();
    if (trackMouse.current && event.isDragging) {
      const delta = (event.clientX - event.dragStart[0]) / 20;
      setValue(Math.min(100, Math.max(0, value + delta)));
    }
  };

  useEffect(() => {
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
  }, []);

  const rads = -Math.PI * (3 / 2) + value * 3.6 * ((2 * Math.PI) / 180);
  const y2 = center + Math.sin(rads) * r;
  const x2 = center + Math.cos(rads) * r;
  return (
    <svg
      onMouseDown={(e) => { trackMouse.current = true; }}
      width={props.size}
      height={props.size}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg">
      <circle
        cx={center}
        cy={center}
        r={r}
        stroke="black"
        strokeWidth={strokeWidth}
        fill="grey"
      />
      <line
        x1={center}
        y1={center}
        x2={x2}
        y2={y2}
        stroke="blue"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
