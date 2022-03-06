
import React, {useState} from "react";
import {TableCell} from "@material-ui/core";
import {AlbumTwoTone} from "@material-ui/icons";

export function SampleTableCell(props) {
  return (
    <TableCell colSpan={props.tile.cols} rowSpan={props.tile.rows}>
      <div
        style={{backgroundColor: props.tile.color, position: "relative"}}
        // onClick={() => triggerSample()}
        className={"pad"}>
        <div style={{position: "relative"}}>
          <div className={props.tile.active ? "beatStrip" : ""} />
        </div>
        <div style={{padding: "1%"}}>
          <p className="sampleLabel">{props.tile.name}</p>
          <p style={{textAlign: "center"}}>
            <AlbumTwoTone />
          </p>
        </div>
      </div>
    </TableCell>
  );
}
