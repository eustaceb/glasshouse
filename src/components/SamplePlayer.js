import React, {useState} from "react";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";

import {FxPad} from "./FxPad.js";
import {Navigation} from "./Navigation.js";
import {SamplePad} from "./SamplePad.js";

export function SamplePlayer(props) {
  const [frameNumber, setFrameNumber] = useState(0);
  const frame = props.composition.getFrame(frameNumber);
  const frameName = props.composition.getFrameName(frameNumber);
  const playSample = (sampleIndex) => {
    props.sampler.playSample(sampleIndex);
  };
  const stopSample = (sampleIndex) => {
    props.sampler.stopSample(sampleIndex);
  };

  const switchFrame = (frameNumber) => {
    props.sampler.stopAllSamples();
    props.composition.getBackgroundSampleNames(frameNumber).forEach((sampleName) => {
      props.sampler.playSampleByName(sampleName);
    });
    setFrameNumber(frameNumber);
  }

  const generatePad = (cell, index) => (
    <TableCell
      key={frameName + index.toString()}
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
        <TableRow>
          <TableCell colSpan={5}>
            <Navigation
              setPage={(frameNumber) => switchFrame(frameNumber)}
              page={frameNumber}
              pageName={frameName}
              pageCount={props.composition.getFrameCount()}
            />
          </TableCell>
        </TableRow>
        {frame.map((row, index) => (
          <TableRow key={frameName + index.toString()}>{row.map(generatePad)}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
