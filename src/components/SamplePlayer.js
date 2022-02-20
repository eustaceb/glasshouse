import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import {FXPanel} from "./FXPanel.js";
import {SamplePad} from "./SamplePad.js";

export function SamplePlayer(props) {
  const [selectedSample, setSelectedSample] = useState(null);
  const samples = props.sampler.getSamples();

  const playSample = (sampleIndex) => {
    props.sampler.playSample(sampleIndex);
  };
  const stopSample = (sampleIndex) => {
    props.sampler.stopSample(sampleIndex);
  };

  const openFXPanel = (index) => {
    index != selectedSample
      ? setSelectedSample(index)
      : setSelectedSample(null);
  };

  const samplePads = samples.map((sample, index) => {
    return (
      <Grid item xs={6} xl={2} key={index}>
        <SamplePad
          sample={sample}
          playSample={() => playSample(index)}
          stopSample={() => stopSample(index)}
          openFXPanel={() => openFXPanel(index)}
          isFxPanelOpen={selectedSample == index}
          selected={sample.isActive()}
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
            width: "100%",
          }}>
          <FXPanel
            effects={sample.fx.effects}
            panelColor={sample.color}
            setFxParam={(fxName, param, value) =>
              sample.fx.setFxParam(fxName, param, value)
            }
          />
        </div>
      </div>
    );
  });

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        {fxPanels}
      </Grid>
      <Grid container item xs={6} spacing={2}>
        <Grid container>{samplePads}</Grid>
      </Grid>
    </Grid>
  );
}
