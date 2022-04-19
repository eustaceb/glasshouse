import React, {useState} from "react";
import {Button, ButtonGroup} from "@material-ui/core";

export function MultistateSwitch(props) {
  const [selection, setSelection] = useState(props.initialSelection);

  const handleSelection = (sel) => {
    props.optionCallbacks[sel]();
    setSelection(sel);
  };

  const buttons = props.optionLabels.map((label, i) => (
    <Button
      key={i}
      color={selection == i ? "secondary" : "success"}
      onClick={() => handleSelection(i)}
      disableElevation>
      {label}
    </Button>
  ));

  return (
    <div>
      {props.label}
      <ButtonGroup>{buttons}</ButtonGroup>
    </div>
  );
}
