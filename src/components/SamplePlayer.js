import * as Tone from "tone";
import React, {useState} from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import {KnobControl} from "./KnobControl.js";
import {SamplePad} from "./SamplePad.js";

function PadsControl(props) {
  const samples = props.samples.map((sample, index) => {
    const isSelected = index == props.selectedSampleIndex;
    return (
      <Grid item xs={2} key={index}>
        <SamplePad
          sample={sample}
          onClick={() => props.selectSample(index)}
          selected={isSelected}
          playSample={() => props.playSample(index)}
        />
      </Grid>
    );
  });

  return (
    <Grid container spacing={4} style={{margin: "0 auto"}}>
      {samples}
    </Grid>
  );
}

function LabeledCheckbox(props) {
  const checkbox = <Checkbox onChange={props.onChange} />;
  return <FormControlLabel control={checkbox} label={props.label} />;
}

export function SamplePlayer(props) {
  const [selectedSampleIndex, setSample] = useState(0);
  const [distortionEnabled, enableDistortion] = useState(false);
  const [distortionAmount, setDistortionAmount] = useState(0.0);

  const playSample = (sampleIndex) => {
    const samples = props.samples;
    if (sampleIndex != null && sampleIndex < samples.length) {
      console.log("Playing sample " + samples[sampleIndex].name);

      var player = new Tone.Player(samples[sampleIndex].buffer).toDestination();

      if (distortionEnabled) {
        const distortion = new Tone.Distortion(
          distortionAmount
        ).toDestination();
        player.connect(distortion);
      }

      if (samples[sampleIndex].isLooping) {
        player.loop = true;
      }
      console.log(
        "sampleName: %s, sampleIndex: %d, distortionEnabled: %s, distortionAmount: %d, isLooping: %s",
        samples[sampleIndex].name,
        sampleIndex,
        distortionEnabled,
        distortionAmount,
        samples[sampleIndex].isLooping
      );
      Tone.loaded().then(() => {
        player.start();
      });
    }
  };

  return (
    <Grid
      container
      spacing={2}
      item
      xs={12}
      justify="center"
      alignItems="center">
      <PadsControl
        samples={props.samples}
        selectSample={(sampleIndex) => setSample(sampleIndex)}
        playSample={(sampleIndex) => playSample(sampleIndex)}
        selectedSampleIndex={selectedSampleIndex}
      />
      <Grid container item xs={12} justify="center" alignItems="center">
        <p>Selected sample: {props.samples[selectedSampleIndex].name}</p>
      </Grid>
      <Grid container item xs={12} justify="center" alignItems="center">
        <Grid item xs={12}>
          <div style={{"textAlign": "center"}}>
          <KnobControl
            label="Distortion Amount"
            size={50}
            mouseController={props.mouseController}
            callback={(val) => {
              setDistortionAmount(val / 100.0);
            }}
          />
            <LabeledCheckbox
              label="Enable Distortion"
              onChange={(e) => enableDistortion(e.target.checked)}
            /></div>
        </Grid>
      </Grid>
    </Grid>
  );
}
