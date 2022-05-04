import React, {useState, useEffect} from "react";

import {uuidv4} from "../utils/GUID.js";
import {clamp, scale} from "../utils/Math.js";
import {useLocalContext} from "../utils/ReactHelpers.js";

// Dirty hack to pick up current UI scale. Sorry.
function getUIScale() {
  const transform = window.getComputedStyle(
    document.getElementById("mainContainer")
  ).transform;
  // "matrix(0.7, 0, 0, 0.7, 0, -114.464)"
  if (transform && transform !== "none") {
    const scale = parseFloat(transform.split("(")[1].split(",")[0]);
    return 1 / scale;
  }
  return 1;
}

export function XYPadStyled(props) {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const [componentId, setComponentId] = useState(uuidv4());
  const ctx = useLocalContext({x, y, componentId});

  const getRelativePosition = (x, y, rect, trackerSize, scale) => {
    const trackerMiddle = trackerSize / 2;
    const relativeX = x - rect.x - trackerMiddle;
    const relativeY = y - rect.y - trackerMiddle;

    // Constrain
    const constrainedX = clamp(relativeX, 0, rect.width - trackerSize);
    const constrainedY = clamp(relativeY, 0, rect.height - trackerSize);

    return [constrainedX * scale, constrainedY * scale];
  };

  const normalisePosition = (x, y, rect) => {
    // Scale to [0, 1]
    const scaledX = scale(x, 0, rect.width, 0, 1);
    const scaledY = scale(y, 0, rect.height, 0, 1);
    return [scaledX, scaledY];
  };

  const mouseMove = React.useCallback(
    (e) => {
      if (e.dragOrigin != null) {
        const thisElement =
          e.dragOrigin.id === componentId || e.dragOrigin.id === "xyPadTracker";
        if (e.isDragging && thisElement) {
          const rect = document
            .getElementById(componentId)
            .getBoundingClientRect();

          const trackerSize = document
            .getElementById("xyPadTracker")
            .getBoundingClientRect().width;

          // Calculate pos relative to dom element
          const [relativeX, relativeY] = getRelativePosition(
            e.clientX,
            e.clientY,
            rect,
            trackerSize,
            getUIScale()
          );

          // Transform to [0, 1] space
          const [normalX, normalY] = normalisePosition(
            relativeX,
            relativeY,
            rect
          );

          // Only update state if value has changed
          if (Math.abs(relativeX - ctx.x) > 0.0000001) {
            if (props.callbackX) props.callbackX(normalX);
            setX(relativeX);
          }
          if (Math.abs(relativeY - ctx.y) > 0.0000001) {
            if (props.callbackY) props.callbackY(normalY);
            setY(relativeY);
          }
        }
      }
    },
    [props.callbackX, props.callbackY]
  );

  const mouseDown = React.useCallback((e) => {
    // Check if we clicked on one of the elements in the SVG
    const thisElement =
      e.target.id === componentId || e.target.id === "xyPadTracker";
    if (thisElement) {
      const componentDom = document.getElementById(componentId);
      componentDom.style.cursor = "none";
      const rect = componentDom.getBoundingClientRect();
      const trackerSize = document
        .getElementById("xyPadTracker")
        .getBoundingClientRect().width;

      // Calculate pos relative to dom element
      const [relativeX, relativeY] = getRelativePosition(
        e.clientX,
        e.clientY,
        rect,
        trackerSize,
        getUIScale()
      );

      // Transform to [0, 1] space
      const [normalX, normalY] = normalisePosition(relativeX, relativeY, rect);

      setX(relativeX);
      setY(relativeY);
      if (ctx.callbackX) ctx.callbackX(normalX);
      if (ctx.callbackY) ctx.callbackY(normalY);
    }
  });

  const mouseUp = (_) => {
    const componentDom = document.getElementById(componentId);
    if (componentDom !== null) componentDom.style.cursor = "default";
  };

  useEffect(() => {
    const rect = document.getElementById(componentId).getBoundingClientRect();
    const trackerSize = document
      .getElementById("xyPadTracker")
      .getBoundingClientRect().width;
    const trackerMiddle = trackerSize / 2;
    setX((rect.width / 2 - trackerMiddle) * getUIScale());
    setY((rect.height / 2 - trackerMiddle) * getUIScale());

    props.mouseController.registerListener(componentId, "mouseDown", mouseDown);
    props.mouseController.registerListener(componentId, "mouseMove", mouseMove);
    props.mouseController.registerListener(componentId, "mouseUp", mouseUp);

    return () => {
      props.mouseController.removeListener(componentId, "mouseDown");
      props.mouseController.removeListener(componentId, "mouseMove");
      props.mouseController.removeListener(componentId, "mouseUp");
    };
  }, [props.fx, props.mouseController]);

  return (
    <div className={props.boxClassName} id={componentId}>
      <div
        id={"xyPadTracker"}
        className={props.trackerClassName}
        style={{top: y, left: x}}></div>
    </div>
  );
}
