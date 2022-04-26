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

  if (instruments.length == 5) {
    const groupOfTwo = instruments.slice(0, 2);
    const groupofThree = instruments.slice(2, 5);
    return (
      <div className={"instrumentContainer"}>
        <div className={"instrumentPair"}>{groupOfTwo}</div>
        <div className={"instrumentContainer"}>{groupofThree}</div>
      </div>
    );
  } else {
    return <div className={"instrumentContainer"}>{instruments}</div>;
  }
}
