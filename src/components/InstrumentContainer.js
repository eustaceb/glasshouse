import React, {useState, useEffect} from "react";
import {Instrument} from "./Instrument.js";

export function InstrumentContainer(props) {
  const instruments = props.instruments.map((instrument, i) => (
    <Instrument
      key={i}
      playSample={() => props.playSample(instrument.id)}
      stopSample={() => props.stopSample(instrument.id)}
      sample={instrument}
    />
  ));

  return <div className={"instrumentContainer"}>{instruments}</div>;
}
