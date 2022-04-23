import React, {useState, useEffect} from "react";
import {Instrument} from "./Instrument.js";

export function InstrumentContainer(props) {
    const playSample = (sampleIndex) => {
        props.sampler.playSample(sampleIndex);
      };
      const stopSample = (sampleIndex) => {
        props.sampler.stopSample(sampleIndex);
      };
      const sample = props.sampler.getSampleByName("Bass Section1");

  const instruments = props.instruments.map((instrument, i) => (
    <Instrument
      name={instrument["name"]}
      key={i}
      playSample={() => playSample(sample.id)}
      stopSample={() => stopSample(sample.id)}
      sample={sample}
      shape={instrument["shape"]}
    />
  ));

  return <div className={"instrumentContainer"}>{instruments}</div>;
}
