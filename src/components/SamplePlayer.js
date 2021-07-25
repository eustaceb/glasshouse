import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {FXPanel} from "./FXPanel.js";
import {SamplePad} from "./SamplePad.js";

function PadsControl(props) {
  const samples = props.samples.map((sample, index) => {
    return (
      <Grid item xs={2} key={index}>
        <SamplePad
          sample={sample}
          playSample={() => props.playSample(index)}
          openFXPanel={() => props.openFXPanel(index)}
          isFxPanelOpen={props.selectedSample == index}
          selected={sample.isPlaying}
        />
      </Grid>
    );
  });

  return <Grid container>{samples}</Grid>;
}

export function SamplePlayer(props) {
  const [selectedSample, setSelectedSample] = useState(null);
  const [playing, setPlaying] = useState(
    new Array(props.sampler.getSamples().size).fill(false)
  );
  const samples = props.sampler.getSamples();

  const playSample = (sampleIndex) => {
    const sample = samples[sampleIndex];
    sample.trigger();

    // isPlaying will be updated by now so no need to negate
    setPlaying(playing.splice(sampleIndex, 1, sample.isPlaying));
  };

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} spacing={2}>
        <PadsControl
          samples={samples}
          playSample={playSample}
          selectedSample={selectedSample}
          openFXPanel={(index) => {
            // TODO: This should select the active sample for FX control
            props.sampler.setActiveSample(index);
            index != selectedSample
              ? setSelectedSample(index)
              : setSelectedSample(null);
          }}
        />
      </Grid>
      {selectedSample != null && (
        <FXPanel
          sample={samples[selectedSample]}
          mouseController={props.mouseController}
        />
      )}
    </Grid>
  );
}
