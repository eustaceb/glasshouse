import React, {useState} from "react";
import {AlbumTwoTone} from "@material-ui/icons";

export function FxPad(props) {
  const [isActive, setActive] = useState(false);
  const cell = props.cell;

  const trigger = () => {
    cell.fx.enable(!isActive);
    setActive(!isActive);
  };

  return (
    <div
      style={{backgroundColor: cell.getColor(), position: "relative"}}
      onClick={trigger}
      className={isActive ? "pad fillHeight blinkingSlow" : "pad fillHeight"}>
      <div style={{padding: "1%"}}>
        <p className="sampleLabel">{cell.getName()}</p>
        <p style={{textAlign: "center"}}>
          <AlbumTwoTone />
        </p>
      </div>
    </div>
  );
}
