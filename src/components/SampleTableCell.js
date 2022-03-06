
import React, {useState} from "react";
import {TableCell} from "@material-ui/core";
import {AlbumTwoTone} from "@material-ui/icons";

export function SampleTableCell(props) {
  const cell = props.cell;

  return (
    <TableCell colSpan={cell.cols} rowSpan={cell.rows} className="fillHeight">
      <div
        style={{backgroundColor: cell.getColor(), position: "relative"}}
        // onClick={() => triggerSample()}
        className={"pad fillHeight"}>
        <div style={{position: "relative"}}>
          <div className={cell.getName().length > 5 ? "beatStrip" : ""} />
        </div>
        <div style={{padding: "1%"}}>
          <p className="sampleLabel">{cell.getName()}</p>
          <p style={{textAlign: "center"}}>
            <AlbumTwoTone />
          </p>
        </div>
      </div>
    </TableCell>
  );
}
