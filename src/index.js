import React, {useState} from "react";
import ReactDOM from "react-dom";
import {SampleTable} from "./components/SampleTable.js";
import {Grid} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import {synthTheme} from "./theme.js";
import * as Tone from "tone";
import {MouseController} from "./controllers/MouseController.js";
import {PlaybackController} from "./controllers/PlaybackController.js";
import {SampleController} from "./controllers/SampleController.js";
import "./style.css";

if (process.env.NODE_ENV !== "production") {
  console.log("Looks like we are in development mode!");
}

const mouseController = new MouseController(window.document);
const sampler = new SampleController();
const playback = new PlaybackController(sampler);

function StartModal(props) {
  return (
    <div className="startModal">
      <p>
        <a href="#" className="start" onClick={() => props.start()}>
          Start
        </a>
      </p>
    </div>
  );
}

const TileColors = {
  SAMPLE: ["#CD5C5C", "#F08080", "#FA8072", "#E9967A", "#FFA07A"],
  FX: ["#9ad7e6", "#9ad7e6", "#b2d1d9", "#5edfff", "#70b7cf"],
};

function getColor(tileType) {
  const selection = Math.round(Math.random() * 4);
  return TileColors[tileType][selection];
}

function createSampleTile(name, rows, cols, active=false) {
  const type = "SAMPLE";
  return {name: name, rows: rows, cols: cols, type: type, active: active, color: getColor(type)};
}
function createFxTile(name, rows, cols, active=false) {
  const type = "FX";
  return {name: name, rows: rows, cols: cols, type: type, active: active, color: getColor(type)};
}

function getTiles() {
  const row1 = [
    createSampleTile("Vocals", 2, 3, true),
    createSampleTile("Back Vocals", 1, 2),
  ];
  const row10 = [createFxTile("Echo", 1, 1), createFxTile("Pitch Shift", 1, 1)];
  const row2 = [createSampleTile("Drums", 1, 5, true)];
  const row3 = [
    createFxTile("Vibrato", 1, 1),
    createFxTile("Chorus", 1, 1),
    createFxTile("Echo", 1, 1),
    createSampleTile("Sham", 1, 2),
  ];
  const row4 = [createSampleTile("Sham", 1, 3), createSampleTile("Pads", 1, 2)];
  const tiles = [row1, row10, row2, row3, row4];

  // Gen IDs
  for (var i = 0; i < tiles.length; i++) tiles[i].id = i;
  return tiles;
}

function App(props) {
  const [initialised, setInitialised] = useState(false);

  const start = function () {
    Tone.start();
    props.sampler.playSample(0);
    props.playback.start(0);
    // Start off with first sample playing
    setInitialised(true);
  };

  return (
    <ThemeProvider theme={synthTheme}>
      {initialised ? (
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <p style={{textAlign: "center"}} id="timestamp">
              0:0:0
            </p>
          </Grid>
          <SampleTable tiles={getTiles()}/>
        </Grid>
      ) : (
        <StartModal start={() => start()} />
      )}
    </ThemeProvider>
  );
}

ReactDOM.render(
  <App
    mouseController={mouseController}
    sampler={sampler}
    playback={playback}
  />,
  document.getElementById("root")
);
