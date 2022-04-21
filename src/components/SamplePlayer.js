import React, {useState} from "react";
import {Slider, Table, TableBody, TableCell, TableRow} from "@material-ui/core";

import {KnobControl} from "./KnobControl.js";
import {Navigation} from "./Navigation.js";
import {SamplePad} from "./SamplePad.js";
import {XYPad} from "./XYPad.js";
import {MultistateSwitch} from "./MultistateSwitch.js";
import {VolumeSlider} from "./VolumeSlider.js";

function SampleGroup(props) {
  const fx = props.group.getFx();
  const volume = props.group.getVolume();
  const mouseController = props.mouseController;

  const playSample = (sampleIndex) => {
    // Stop other samples in group
    props.group.getSamples().forEach((s) => {
      if (sampleIndex !== s.id && s.isPlaying()) props.stopSample(s.id);
    });
    props.playSample(sampleIndex);
  };

  const pads = props.group.getSamples().map((s) => (
    <TableCell key={s.id}>
      <SamplePad
        className="fillHeight"
        sample={s}
        playSample={() => playSample(s.id)}
        stopSample={() => props.stopSample(s.id)}
      />
    </TableCell>
  ));

  const createFxComponent = (fx) =>
    fx.hasOwnProperty("xAxis") ? (
      <XYPad
        size={100}
        label={fx.getLabel()}
        mouseController={mouseController}
        fx={fx}
        callbackX={(val) => fx.setX(val / 100.0)}
        callbackY={(val) => fx.setY(val / 100.0)}
      />
    ) : (
      <KnobControl
        size={50}
        label={fx.getLabel()}
        minValue={0}
        maxValue={100}
        mouseController={mouseController}
        callback={(val) => fx.setWet(val / 100)}
      />
    );

  const fxComponent = createFxComponent(fx);

  // Pre-fx
  const preFx = props.group.getPreFx();
  let preFxComponent = null;
  if (preFx !== null) preFxComponent = createFxComponent(preFx);

  return (
    <TableRow>
      <TableCell>{props.group.getName()}</TableCell>
      {pads}
      {preFxComponent !== null && <TableCell>{preFxComponent}</TableCell>}
      <TableCell>{fxComponent}</TableCell>
      {fx.hasSwitch() && (
        <TableCell>
          <MultistateSwitch
            label={fx.getSwitchParamName()}
            initialSelection={0}
            optionLabels={fx.getSwitchLabels()}
            optionCallbacks={fx.getSwitchCallbacks()}
          />
        </TableCell>
      )}
      <TableCell>
        <VolumeSlider volume={volume} />
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
    <Table style={{width: "80%"}} className="fillHeight">
      <TableBody>
        <TableRow>
          <TableCell colSpan={10}>
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
