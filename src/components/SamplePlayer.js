import React, {useState} from "react";

import {ComponentA} from "./ComponentA.js";
import {Navigation} from "./Navigation.js";
import {InstrumentContainer} from "./InstrumentContainer.js";

export function SamplePlayer(props) {
  const [sectionIndex, setSectionIndex] = useState(2);
  const section = props.composition.getSection(sectionIndex);
  const vocals = section.getGroup("vocals");
  const percussion = section.getGroup("percussion");
  const instruments = section.getInstruments();

  const playSample = (sampleIndex) => {
    props.sampleController.playSample(sampleIndex);
  };
  const stopSample = (sampleIndex) => {
    props.sampleController.stopSample(sampleIndex);
  };

  const stylesTransition = (from, to) => {
    const el = document.getElementsByClassName("componentsContainer")[0];
    el.classList.remove(from);
    el.classList.add(to);
  };

  const setSection = (sectionIndex) => {
    props.sampleController.stopAllSamples();
    stylesTransition("fadeIn", "fadeOut");

    setTimeout(() => {
      stylesTransition("fadeOut", "fadeIn");
      setSectionIndex(sectionIndex);
    }, 600);
  };

  return (
    <>
      <div className="componentsContainer">
        <ComponentA
          group={vocals}
          mouseController={props.mouseController}
          playSample={playSample}
          stopSample={stopSample}
          description={vocals.getComponentDescription()}
        />
        <InstrumentContainer
          playSample={playSample}
          stopSample={stopSample}
          instruments={instruments}
        />
        <ComponentA
          group={percussion}
          mouseController={props.mouseController}
          playSample={playSample}
          stopSample={stopSample}
          description={percussion.getComponentDescription()}
        />
      </div>
      <div className="padding"></div>
      <div className="footerContainer">
        <Navigation
          sectionIndex={sectionIndex}
          setSection={setSection}
          sectionCount={3}
        />
      </div>
    </>
  );
}
