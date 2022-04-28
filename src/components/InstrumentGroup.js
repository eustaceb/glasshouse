import React from "react";

import {Instrument} from "./Instrument.js";

export function InstrumentGroup(props) {
  const samples = props.group.getSamples();

  const playSample = (sampleIndex) => {
    // Stop other samples in group
    samples.forEach((s) => {
      if (sampleIndex !== s.id && (s.isPlaying() || s.isScheduled()))
        props.stopSample(s.id);
    });
    props.playSample(sampleIndex);
  };

  const instruments = samples.map((sample, i) => (
    <Instrument
      key={i}
      playSample={() => playSample(sample.id)}
      stopSample={() => props.stopSample(sample.id)}
      sample={sample}
    />
  ));
  return <>{instruments}</>;
}
