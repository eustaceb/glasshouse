import React, {useState} from "react";

export function LayeredButton(props) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <div
      className={
        props.cssName + ((active ? "Active" : "") + (hover ? "Hover" : ""))
      }
      onClick={() => {
        props.callback();
        setActive(!active);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={props.shape ? {clipPath: props.shape} : null}
    />
  );
}
