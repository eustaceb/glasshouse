import React, {useState} from "react";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";

import {KnobControl} from "./KnobControl.js";
import {Navigation} from "./Navigation.js";
import {SamplePad} from "./SamplePad.js";
import {XYPad} from "./XYPad.js";
import { FXControl } from "../controllers/FXControls.js";

function SampleGroup(props) {
  const fx = props.group.getFx();

  const pads = props.group.getSamples().map((s) => (
    <TableCell key={s.id}>
      <SamplePad
        className="fillHeight"
        sample={s}
        playSample={() => props.playSample(s.id)}
        stopSample={() => props.stopSample(s.id)}
      />
    </TableCell>
  ));
  return (
    <TableRow>
      <TableCell>{props.group.getName()}</TableCell>
      {pads}
      <TableCell>
        <KnobControl
          size={50}
          label={fx.getLabel()}
          minValue={0}
          maxValue={100}
          mouseController={props.mouseController}
          callback={(val) => fx.setWet(val / 100)}
        />
      </TableCell>
    </TableRow>
  );
}

export function SamplePlayer(props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const section = props.composition.getSection(sectionIndex);
  const vocals = section.getGroup("vocals");
  const percussion = section.getGroup("percussion");
  const clap = section.hasGroup("clap") ? section.getGroup("clap") : null;

  const playSample = (sampleIndex) => {
    props.sampler.playSample(sampleIndex);
  };
  const stopSample = (sampleIndex) => {
    props.sampler.stopSample(sampleIndex);
  };

  const setSection = (sectionIndex) => {
    props.sampler.stopAllSamples();
    setSectionIndex(sectionIndex);
  };

  const instruments = section.getInstruments().map((s) => {
    return (
      <TableCell key={s.id}>
        <SamplePad
          className="fillHeight"
          sample={s}
          playSample={() => playSample(s.id)}
          stopSample={() => stopSample(s.id)}
        />
      </TableCell>
    );
  });

  return (
    <Table style={{width: "60%"}} className="fillHeight">
      <TableBody>
        <TableRow>
          <TableCell colSpan={9}>
            <Navigation
              setSection={(sectionIndex) => setSection(sectionIndex)}
              sectionIndex={sectionIndex}
              sectionName={section.name}
              sectionCount={props.composition.getSectionCount()}
            />
          </TableCell>
        </TableRow>
        <SampleGroup
          playSample={playSample}
          stopSample={stopSample}
          group={vocals}
          mouseController={props.mouseController}
        />
        <SampleGroup
          playSample={playSample}
          stopSample={stopSample}
          group={percussion}
          mouseController={props.mouseController}
        />
        {clap && (
          <SampleGroup
            playSample={playSample}
            stopSample={stopSample}
            group={clap}
            mouseController={props.mouseController}
          />
        )}
        <TableRow>
          <TableCell>instruments</TableCell>
          {instruments}
        </TableRow>
      </TableBody>
    </Table>
  );
}
