import React, {useState} from "react";
import LoopIcon from "@material-ui/icons/Loop";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";

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
      backgroundColor: "purple",
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
    selected: {
      backgroundColor: "mediumvioletred",
    },
  };

  let containerStyle = {...styles.selectableSquare, ...styles.round};
  if (props.selected) {
    containerStyle = {...containerStyle, ...styles.selected};
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
