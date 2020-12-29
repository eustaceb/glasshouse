import * as Tone from "tone";
import React, { useState } from "react";
import { Button } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import { KnobControl } from "./KnobControl.js";
import { SamplePad } from "./SamplePad.js";

function PadsControl(props) {
  const samples = props.samples.map((sample, index) => {
    const isSelected = index == props.selectedSampleIndex;
    return (
      <Grid item xs={2} key={index} >
        <SamplePad
          sample={sample}
          onClick={() => props.selectSample(index)}
          selected={isSelected} />
      </Grid>
    );
  });

  return <Grid container spacing={4}>{samples}</Grid>;
}

function LabeledCheckbox(props) {
  const checkbox = <Checkbox onChange={props.onChange} />;
  return <FormControlLabel control={checkbox} label={props.label} />;
}

export function SamplePlayer(props) {
  const [selectedSampleIndex, setSample] = useState(0);
  const [distortionEnabled, enableDistortion] = useState(false);
  const [distortionAmount, setDistortionAmount] = useState(0.0);
  const [loopSample, enableLoop] = useState(false);

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

      if (loopSample) {
        player.loop = true;
      }
      console.log(
        "sampleName: %s, sampleIndex: %d, distortionEnabled: %s, distortionAmount: %d, loopSample: %s",
        samples[sampleIndex].name,
        sampleIndex,
        distortionEnabled,
        distortionAmount,
        loopSample
      );
      Tone.loaded().then(() => {
        player.start();
      });
    }
  };

  return (
    <Grid container spacing={2} item xs={12}>
      <PadsControl
        samples={props.samples}
        selectSample={(sampleIndex) => setSample(sampleIndex)}
        selectedSampleIndex={selectedSampleIndex} />
      <Grid container item xs={12}>
        <p>Selected sample: {props.samples[selectedSampleIndex].name}</p>
      </Grid>
      <Grid container item xs={6}>
        <Grid item xs={4}>
          <KnobControl
            label="Distortion Amount"
            size={50}
            mouseController={props.mouseController}
            callback={(val) => { setDistortionAmount(val / 100.0) }}
          />
        </Grid>
        <Grid container item xs={4} align="center" justify="center" direction="column">
          <LabeledCheckbox
            label="Enable Distortion"
            onChange={(e) => enableDistortion(e.target.checked)}
          />
        </Grid>
        <Grid item xs={4} />
      </Grid>
      <Grid item xs={6} />
      <Grid item xs={3}>
        <LabeledCheckbox
          label="Loop"
          onChange={(e) => enableLoop(e.target.checked)}
        />
      </Grid>
      <Grid item xs={9} />
      <Grid container item xs={3} spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => playSample(selectedSampleIndex)}>
          Play Sample
        </Button>
      </Grid>
    </Grid>
  );
}
