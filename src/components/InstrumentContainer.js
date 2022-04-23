import React, {useState, useEffect} from "react";
import {Instrument} from "./Instrument.js";

export function InstrumentContainer(props) {
  const instruments = props.instruments.map((instrument, i) => (
    <Instrument
      name={instrument["name"]}
      key={i}
    />
  ));

  return <div className={"instrumentContainer"}>{instruments}</div>;
}
