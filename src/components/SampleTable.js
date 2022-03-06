import React, {useState} from "react";
import {Table, TableBody, TableRow} from "@material-ui/core";

import {SampleTableCell} from "./SampleTableCell.js";

export function SampleTable(props) {
  const [frameNumber, setFrameNumber] = useState(0);
  const frame = props.composition.getFrame(frameNumber);

  return (
    <Table style={{width: "40%"}} className="fillHeight">
      <TableBody>
        {frame.map((row, index) => (
          <TableRow key={index}>
            {row.map((cell, ci) => (
              <SampleTableCell key={ci} cell={cell} />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
