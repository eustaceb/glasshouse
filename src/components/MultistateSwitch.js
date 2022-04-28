import React, {useState} from "react";

export function MultistateSwitch(props) {
  const [selection, setSelection] = useState(props.initialSelection);

  const handleSelection = (sel) => {
    props.optionCallback(sel);
    setSelection(sel);
  };

  const bubbles = props.optionLabels.map((label, i) => (
    <div
      key={i}
      className={"switchCircle" + (i == selection ? " switchCircleActive" : "")}
      onClick={() => handleSelection(i)}
    />
  ));

  return <div className={"switchContainer"}>{bubbles}</div>;
}
