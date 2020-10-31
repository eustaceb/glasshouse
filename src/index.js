import * as Tone from "tone";
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';


const samples = [
    {
        "name": "hihats",
        "path": "audio/hihats.mp3",
        "buffer": new Tone.Buffer("audio/hihats.mp3"),
    },
    {
        "name": "synth",
        "path": "audio/synth.mp3",
        "buffer": new Tone.Buffer("audio/synth.mp3"),
    },
];

function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
}

function SampleList(props) {    
    const samples = props.samples.map((sample) =>
        <ListItemLink key={sample.name} onClick={() => props.selectSample(sample.name)}>
            <ListItemText primary={sample.name}/>
        </ListItemLink>
    );

    return (
        <List component="nav">
            {samples}
        </List>
    );
}

function SamplePlayer(props) {
    const [selectedSample, setSample] = useState('');
    const [distortionEnabled, enableDistortion] = useState(false);
    const [distortionAmount, setDistortionAmount] = useState(0.0);
    const [loopSample, enableLoop] = useState(false);

    const playSample = (sampleName) => {

        const sampleIndex = samples.findIndex(obj => obj.name == sampleName);

        console.log("Playing sample " + samples[sampleIndex].name);

        var player = new Tone.Player(samples[sampleIndex].buffer).toDestination();
    
        if (distortionEnabled) {
            const distortion = new Tone.Distortion(distortionAmount).toDestination();
            player.connect(distortion);
        }
    
        if (loopSample) {
            player.loop = true;
        }
        console.log("sampleName: %s, sampleIndex: %d, distortionEnabled: %s, distortionAmount: %d, loopSample: %s", sampleName, sampleIndex, distortionEnabled, distortionAmount, loopSample);
        Tone.loaded().then(() => {
            player.start();
        });
    }

    return (
        <div>
            <SampleList samples={props.samples} selectSample={(name) => {console.log("Selecting" + name); setSample(name)}} />
            <Checkbox label="Enable Distortion" onChange={e => enableDistortion(e.target.checked)} />
            <TextField label="Distortion Amount" type="number" />
            <Checkbox value="loop" onChange={e => enableLoop(e.target.checked)} />
            <Button variant="contained" color="primary" onClick={() => playSample(selectedSample)}>Play Sample</Button>
        </div>
    )
}

ReactDOM.render(<SamplePlayer samples={samples} />, document.getElementById('samplePlayer'));
