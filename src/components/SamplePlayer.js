import React, {useState} from "react";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";

import {FxPad} from "./FxPad.js";
import {SamplePad} from "./SamplePad.js";

export function SamplePlayer(props) {
  const [frameNumber, setFrameNumber] = useState(0);
  const frame = props.composition.getFrame(frameNumber);

  const playSample = (sampleIndex) => {
    props.sampler.playSample(sampleIndex);
  };
  const stopSample = (sampleIndex) => {
    props.sampler.stopSample(sampleIndex);
  };

  const generatePad = (cell, index) => (
    <TableCell
      key={index}
      colSpan={cell.cols}
      rowSpan={cell.rows}
      className="fillHeight">
      {cell.isSample() ? (
        <SamplePad
          cell={cell}
          playSample={() => playSample(cell.sample.id)}
          stopSample={() => stopSample(cell.sample.id)}
        />
      ) : (
        <FxPad cell={cell} />
      )}
    </TableCell>
  );

  return (
    <Table style={{width: "40%"}} className="fillHeight">
      <TableBody>
        {frame.map((row, index) => (
          <TableRow key={index}>{row.map(generatePad)}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
