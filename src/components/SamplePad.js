import React, {useState} from "react";
import LoopIcon from "@material-ui/icons/Loop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import { assert } from "tone/build/esm/core/util/Debug";

function PlaybackControls(props) {
  return (
    <div style={{textAlign: "center"}}>
      <PlayArrowIcon fontSize="large" onClick={() => props.playSample()} />
      <StopIcon fontSize="large" />
    </div>
  );
}

export function RepeatControls(props) {
  const [bars, setBars] = useState(1);
  const [isLooping, setLooping] = useState(false);

  const styles = {
    active: {
      color: "white",
    },
  };

  return (
    <div style={{textAlign: "center"}}>
      <IconButton onClick={() => setBars(Math.max(1, bars - 1))}>
        <RemoveIcon fontSize="small" />
      </IconButton>
      <span>{bars}</span>
      <IconButton onClick={() => setBars(bars + 1)}>
        <AddIcon fontSize="small" />
      </IconButton>
      <LoopIcon
        onClick={() => {
          props.sample.isLooping = !isLooping;
          setLooping(!isLooping);
        }}
        style={isLooping ? {...styles.active} : {}}
      />
    </div>
  );
}

export function SamplePad(props) {
  const styles = {
    selectableSquare: {
      width: 140,
      height: 120,
      cursor: "pointer",
    },
    round: {
      borderRadius: 10,
    },
    sampleLabel: {
      textAlign: "center",
      color: "white",
    },
    nonselectable: {
      WebkitTouchCallout: "none",
      WebkitUserSelect: "none",
      KhtmlUserSelect: "none",
      MozUserSelect: "none",
      MsUserSelect: "none",
      UserSelect: "none",
    },
  };

  let lighten = function(color, pct) {
    assert(pct >= 0 && pct <= 1);
    const hex = parseInt(color.substr(1, 6), 16);
    const r = Math.round(Math.min(((hex & 0xFF0000) >> 16) * (1 + pct), 255)).toString(16);
    const g = Math.round(Math.min(((hex & 0x00FF00) >> 8) * (1 + pct), 255)).toString(16);
    const b = Math.round(Math.min((hex & 0x0000FF) * (1 + pct), 255)).toString(16);
    return "#" + ("00" + r).slice(-2) + ("00" + g).slice(-2) + ("00" + b).slice(-2)
  };

  let containerStyle = {...styles.selectableSquare, ...styles.round};
  containerStyle["backgroundColor"] = props.sample.color;
  if (props.selected) {
    containerStyle["backgroundColor"] = lighten(containerStyle["backgroundColor"], 0.3);
  }

  return (
    <div style={containerStyle} onClick={props.onClick}>
      <p style={{...styles.sampleLabel, ...styles.nonselectable}}>
        {props.sample.name}
      </p>
      <PlaybackControls playSample={props.playSample} />
      <RepeatControls enableLoop={props.enableLoop} sample={props.sample} />
    </div>
  );
}
