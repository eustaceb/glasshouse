import React, {useState} from "react";
import {Table, TableBody, TableCell, TableRow} from "@material-ui/core";

import {Navigation} from "./Navigation.js";
import {SamplePad} from "./SamplePad.js";
import {VolumeSlider} from "./VolumeSlider.js";
import {SampleGroup} from "./SampleGroup.js";

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

  const instruments = section.getInstruments().map((instrument) => {
    const s = instrument["sample"];
    const v = instrument["volume"];
    return (
      <TableCell key={s.id}>
        <SamplePad
          className="fillHeight"
          sample={s}
          playSample={() => playSample(s.id)}
          stopSample={() => stopSample(s.id)}
        />
        <VolumeSlider volume={v} />
      </TableCell>
    );
  });

  return (
    <Table className="fillHeight">
      <TableBody>
        <TableRow>
          <TableCell colSpan={11}>
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
