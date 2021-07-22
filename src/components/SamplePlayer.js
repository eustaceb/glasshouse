import * as Tone from "tone";
import React, {useState, useEffect} from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import {KnobControl} from "./KnobControl.js";
import {SamplePad} from "./SamplePad.js";

function PadsControl(props) {
  const samples = props.samples.map((sample, index) => {
    return (
      <Grid item xs={2} key={index}>
        <SamplePad
          sample={sample}
          onClick={() => props.playSample(index)}
          openFXPanel={() => props.openFXPanel(index)}
          isFxPanelOpen={props.selectedSample == index}
          selected={sample.isPlaying}
        />
      </Grid>
    );
  });

  return <Grid container>{samples}</Grid>;
}

function LabeledCheckbox(props) {
  const checkbox = <Checkbox onChange={props.onChange} />;
  return <FormControlLabel control={checkbox} label={props.label} />;
}

export function SamplePlayer(props) {
  const [distortionEnabled, enableDistortion] = useState(false);
  const [distortionAmount, setDistortionAmount] = useState(0.0);
  const [selectedSample, setSelectedSample] = useState(null);
  const samples = props.sampler.getSamples();
  
  const styles = {
    fxPanelContainer: {
      color: "#FFF", margin: "5px", border: "2px grey solid"
    }
  }

  useEffect(() => {
    props.sampler.setActiveSampleCallback((s) => setSelectedSample(s));
  }, [selectedSample, props.sampler]);

  const playSample = (sampleIndex) => {
      const sample = samples[sampleIndex];
      if (sample.isPlaying) sample.stop();
      else sample.play();
  };

  return (
    <Grid container>
      <Grid container item xs={12} spacing={2}>
        <PadsControl
          samples={samples}
          selectSample={(sampleIndex) =>
            props.sampler.setActiveSample(sampleIndex)
          }
          playSample={(sampleIndex) => playSample(sampleIndex)}
          selectedSample={selectedSample}
          openFXPanel={(index) => {
            index != selectedSample
              ? setSelectedSample(index)
              : setSelectedSample(null);
          }}
        />
      </Grid>
      {selectedSample != null && (
        <Grid
          container
          item
          xs={12}
          justifyContent="center"
          alignItems="center"
          style={{backgroundColor: samples[selectedSample].color, ...styles.fxPanelContainer}}>
          <Grid
            container
            item
            xs={12}
            justifyContent="center"
            alignItems="center">
            <p>Selected sample: {samples[selectedSample].name}</p>
          </Grid>
          <Grid item xs={12}>
            <div style={{textAlign: "center"}}>
              <KnobControl
                label="Distortion Amount"
                size={50}
                mouseController={props.mouseController}
                callback={(val) => {
                  samples[selectedSample].setDistortionAmount(val / 100.0)
                  setDistortionAmount(val / 100.0);
                }}
              />
              <LabeledCheckbox
                label="Enable Distortion"
                onChange={(e) => samples[selectedSample].enableDistortion(e.target.checked)}
              />
            </div>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
