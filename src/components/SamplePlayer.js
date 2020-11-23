import * as Tone from "tone";
import React, {useState} from "react";
import {Button} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import {KnobControl} from "./KnobControl.js";

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function SampleList(props) {
  const samples = props.samples.map((sample, index) => {
    const isSelected = index == props.selectedSampleIndex;
    return (
      <ListItemLink
        key={index}
        onClick={() => props.selectSample(index)}
        selected={isSelected}>
        <ListItemText primary={sample.name} />
      </ListItemLink>
    );
  });

  return <List component="nav">{samples}</List>;
}

function LabeledCheckbox(props) {
  const checkbox = <Checkbox onChange={props.onChange} />;
  return <FormControlLabel control={checkbox} label={props.label} />;
}

export function SamplePlayer(props) {
  const [selectedSampleIndex, setSample] = useState();
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
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <SampleList
          samples={props.samples}
          selectSample={(sampleIndex) => setSample(sampleIndex)}
          selectedSampleIndex={selectedSampleIndex}
        />
      </Grid>
      <Grid item xs={9}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <TextField
              label="Distortion Amount"
              type="number"
              onChange={(e) => setDistortionAmount(e.target.value)}
              inputProps={{step: 0.05, type: "number", min: 0.0, max: 1.0}}
            />
            <KnobControl size={100} mouseController={props.mouseController} />
          </Grid>
          <Grid item xs={3}>
            <LabeledCheckbox
              label="Enable Distortion"
              onChange={(e) => enableDistortion(e.target.checked)}
            />
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <LabeledCheckbox
              label="Loop"
              onChange={(e) => enableLoop(e.target.checked)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => playSample(selectedSampleIndex)}>
            Play Sample
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
