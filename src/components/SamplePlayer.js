import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {FXPanel} from "./FXPanel.js";
import {SamplePad} from "./SamplePad.js";

export function SamplePlayer(props) {
  const [selectedSample, setSelectedSample] = useState(null);
  const [playing, setPlaying] = useState(
    new Array(props.sampler.getSamples().size).fill(false)
  );
  const samples = props.sampler.getSamples();

  const playSample = (sampleIndex) => {
    props.sampler.triggerSample(sampleIndex);

    // isPlaying will be updated by now so no need to negate
    setPlaying(playing.splice(sampleIndex, 1, samples[sampleIndex].isPlaying));
  };
  const openFXPanel = (index) => {
    index != selectedSample
      ? setSelectedSample(index)
      : setSelectedSample(null);
  };

  const samplePads = samples.map((sample, index) => {
    return (
      <Grid item xs={2} key={index}>
        <SamplePad
          sample={sample}
          playSample={() => playSample(index)}
          openFXPanel={() => openFXPanel(index)}
          isFxPanelOpen={selectedSample == index}
          selected={sample.isPlaying}
        />
      </Grid>
    );
  });

  const fxPanels = samples.map((sample, index) => {
    return (
      <div style={{position: "relative"}} key={index}>
        <div
          className={index == selectedSample ? "centered" : "centered hidden"}
          style={{
            zIndex: index,
            position: "absolute",
            top: "0px",
            left: "0px",
          }}>
          <FXPanel sample={sample} mouseController={props.mouseController} />
        </div>
      </div>
    );
  });

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12} spacing={2}>
        <Grid container>{samplePads}</Grid>
      </Grid>
      <Grid item xs={12}>
        {fxPanels}
      </Grid>
    </Grid>
  );
}
