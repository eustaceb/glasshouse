import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {FXPanel} from "./FXPanel.js";
import {SamplePad} from "./SamplePad.js";

export function SamplePlayer(props) {
  const [selectedSample, setSelectedSample] = useState(null);
  const samples = props.sampler.getSamples();

  const playSample = (sampleIndex) => {
    if (!props.playback.started) {
      props.playback.start(0.1);
      samples[sampleIndex].play("0:0:0");
    } else {
      console.log(props.playback.GetNextBar());
      samples[sampleIndex].play(props.playback.GetNextBar());
    }
  };
  const stopSample = (sampleIndex) => {
    samples[sampleIndex].stop(props.playback.GetNextBar());
  }

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
          stopSample={() => stopSample(index)}
          openFXPanel={() => openFXPanel(index)}
          isFxPanelOpen={selectedSample == index}
          selected={sample.isPlaying()}
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
