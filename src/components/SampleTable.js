import React, {useState} from "react";
import {Table, TableBody, TableRow} from "@material-ui/core";

import {SampleTableCell} from "./SampleTableCell.js"

export function SampleTable(props) {
  return (
    <Table style={{width: "40%"}}>
      <TableBody>
        {props.tiles.map((row, index) => (
          <TableRow key={index}>
            {row.map((tile, ci) => (
              <SampleTableCell key={ci} tile={tile} />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
