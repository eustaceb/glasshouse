import React, {useState} from "react";

import {ComponentA} from "./ComponentA.js";
import {Navigation} from "./Navigation.js";
import {InstrumentContainer} from "./InstrumentContainer.js";
import {InstrumentGroup} from "./InstrumentGroup.js";


export function SamplePlayer(props) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const section = props.composition.getSection(sectionIndex);
  const vocals = section.getGroup("vocals");
  const percussion = section.getGroup("percussion");
  const clap = section.hasGroup("clap") ? section.getGroup("clap") : null;

  const playSample = (sampleIndex) => {
    props.sampleController.playSample(sampleIndex);
  };
  const stopSample = (sampleIndex) => {
    props.sampleController.stopSample(sampleIndex);
  };

  const setSection = (sectionIndex) => {
    props.sampleController.stopAllSamples();
    setSectionIndex(sectionIndex);
  };

  return (
    <div>
      <div className="componentsContainer">

        <ComponentA 
          group={vocals}
          mouseController={props.mouseController}
          playSample={playSample}
          stopSample={stopSample}
          getSample={(i) => props.sampleController.getSamples()[i]}
          baseClass="vocal"
          instruments={[
            {
              id: 9,
              name: "vocal1Position vocal1",
            },
            {
              id: 10,
              name: "vocal2Position vocal2",
            },
            {
              id: 11,
              name: "vocal3Position vocal3",
            },
          ]}
          
        />

        <InstrumentContainer
          getSample={(i) => props.sampleController.getSamples()[i]}
          playSample={playSample}
          stopSample={stopSample}
          instruments={[
            {
              id: 2,
              name: "bass",
              shape: "polygon(0% 0%,0% 100%,100% 100%, 100% 0)",
            },
            {
              id: 7,
              name: "stringArp",
              shape: "circle(50%)",
            },
            {
              id: 8,
              name: "taiko",
              shape:
                "polygon(35% 0%, 50% 0%, 65% 0%, 100% 35%, 100% 50%, 100% 65%, 65% 100%, 50% 100%, 35% 100%, 0% 65%, 0% 50%, 0% 35%)",
            },
            {
              id: 3,
              name: "clap",
              shape:
                "polygon(48% 0%, 50% 0%, 52% 0%, 100% 80%, 100% 100%,0% 100%, 0% 80% )",
            },
          ]}
        />
        <div className="component componentB"></div>
      </div>
      <div className="padding"></div>
      <div className="footerContainer">
        <Navigation sectionIndex={sectionIndex} setSection={setSection} sectionCount={3} />
      </div>
    </div>
    // <Table className="fillHeight">
    //   <TableBody>
    //     <TableRow>
    //       <TableCell colSpan={11}>
    //         <Navigation
    //           setSection={(sectionIndex) => setSection(sectionIndex)}
    //           sectionIndex={sectionIndex}
    //           sectionName={section.name}
    //           sectionCount={props.composition.getSectionCount()}
    //         />
    //       </TableCell>
    //     </TableRow>
    //     <SampleGroup
    //       playSample={playSample}
    //       stopSample={stopSample}
    //       group={vocals}
    //       mouseController={props.mouseController}
    //     />
    //     <SampleGroup
    //       playSample={playSample}
    //       stopSample={stopSample}
    //       group={percussion}
    //       mouseController={props.mouseController}
    //     />
    //     {clap && (
    //       <SampleGroup
    //         playSample={playSample}
    //         stopSample={stopSample}
    //         group={clap}
    //         mouseController={props.mouseController}
    //       />
    //     )}
    //     <TableRow>
    //       <TableCell>instruments</TableCell>
    //       {instruments}
    //     </TableRow>
    //   </TableBody>
    // </Table>
  );
}
