import React, {useState, useEffect} from "react";
import {Instrument} from "./Instrument.js";

export function InstrumentContainer(props) {
  const instruments = props.instruments.map((instrument, i) => (
    <Instrument
      name={instrument["name"]}
      key={i}
      playSample={() => props.playSample(instrument.id)}
      stopSample={() => props.stopSample(instrument.id)}
      sample={props.getSample(instrument.id)}
      shape={instrument["shape"]}
    />
  ));

  return <div className={"instrumentContainer"}>{instruments}</div>;
}
