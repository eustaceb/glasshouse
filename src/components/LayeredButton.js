import React, {useState} from "react";

export function LayeredButton(props) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={props.cssName + (active ? "Active" : "")}
      onClick={() => {
        props.callback();
        setActive(!active);
      }}
    />
  );
}
