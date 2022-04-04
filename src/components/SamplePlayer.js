import React, {useState} from "react";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";

import {KnobControl} from "./KnobControl.js";
import {Navigation} from "./Navigation.js";
import {SamplePad} from "./SamplePad.js";
import {XYPad} from "./XYPad.js";

export function SamplePlayer(props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const section = props.composition.getSection(sectionIndex);
  const fx1 = section.getEffects()[0];
  const fx2 = section.getEffects()[1];
  const xyFx = section.getXyEffects()[0];

  const sampleTopLeft = section.getFgSamples()[0];
  const sampleTopRight = section.getFgSamples()[1];
  const sampleBotLeft = section.getFgSamples()[2];
  const sampleBotRight = section.getFgSamples()[3];

  const playSample = (sampleIndex) => {
    props.sampler.playSample(sampleIndex);
  };
  const stopSample = (sampleIndex) => {
    props.sampler.stopSample(sampleIndex);
  };

  const setSection = (sectionIndex) => {
    props.sampler.stopAllSamples();
    props.composition
      .getSection(sectionIndex)
      .getBgSamples()
      .forEach((s) => {
        props.sampler.playSample(s.id);
      });
    setSectionIndex(sectionIndex);
  };
  return (
    <Table style={{width: "40%"}} className="fillHeight">
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <Navigation
              setSection={(sectionIndex) => setSection(sectionIndex)}
              sectionIndex={sectionIndex}
              sectionName={section.name}
              sectionCount={props.composition.getSectionCount()}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell rowSpan={2}>
            <KnobControl
              callback={(wet) => fx1.setWet(wet / 100.0)}
              mouseController={props.mouseController}
              size={50}
              label={fx1.type}
              minValue={0}
              maxValue={100}
            />
          </TableCell>
          <TableCell rowSpan={2}>
          <KnobControl
              callback={(wet) => fx2.setWet(wet / 100.0)}
              mouseController={props.mouseController}
              size={50}
              label={fx2.type}
              minValue={0}
              maxValue={100}
            />
          </TableCell>
          <TableCell>
            <SamplePad
              className="fillHeight"
              sample={sampleTopLeft}
              playSample={() => playSample(sampleTopLeft.id)}
              stopSample={() => stopSample(sampleTopLeft.id)}
            />
          </TableCell>
          <TableCell>
            <SamplePad
              className="fillHeight"
              sample={sampleTopRight}
              playSample={() => playSample(sampleTopRight.id)}
              stopSample={() => stopSample(sampleTopRight.id)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <SamplePad
              className="fillHeight"
              sample={sampleBotLeft}
              playSample={() => playSample(sampleBotLeft.id)}
              stopSample={() => stopSample(sampleBotLeft.id)}
            />
          </TableCell>
          <TableCell>
            <SamplePad
              className="fillHeight"
              sample={sampleBotRight}
              playSample={() => playSample(sampleBotRight.id)}
              stopSample={() => stopSample(sampleBotRight.id)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={2}>
            <XYPad
              size={200}
              label={xyFx.type}
              mouseController={props.mouseController}
              fx={xyFx}
              callbackX={(val) => xyFx.setX(val)}
              callbackY={(val) => xyFx.setY(val)}
              minValue
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
