import React from "react";

import {Instrument} from "./Instrument.js";

export function InstrumentGroup(props) {
  const playSample = (sampleIndex) => {
    // Stop other samples in group
    props.group.getSamples().forEach((s) => {
      if (sampleIndex !== s.id && (s.isPlaying() || s.isScheduled()))
        props.stopSample(s.id);
    });
    props.playSample(sampleIndex);
  };

  const instruments = props.instruments.map((instrument, i) => (
    <Instrument
      name={instrument["name"]}
      key={i}
      playSample={() => playSample(instrument.id)}
      stopSample={() => props.stopSample(instrument.id)}
      sample={props.getSample(instrument.id)}
      shape={instrument["shape"]}
      baseClass={props.baseClass}
    />
  ));
  return <>{instruments}</>;
}
