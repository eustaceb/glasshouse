import React, {useState} from "react";
import LoopIcon from "@material-ui/icons/Loop";
import TuneIcon from "@material-ui/icons/Tune";
import {assert} from "tone/build/esm/core/util/Debug";

export function SamplePad(props) {
  const [isLooping, setLooping] = useState(false);

  const styles = {
    pad: {
      borderRadius: 10,
      height: "100px",
      padding: "1%",
      margin: "5px",
      cursor: "pointer",
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
    activeIcon: {
      color: "white",
    },
    paddedIcon: {
      backgroundColor: "orange",
      textAlign: "center",
      padding: "10px",
      margin: "2px",
      cursor: "pointer",
    },
  };

  let lighten = function (color, pct) {
    assert(pct >= 0 && pct <= 1);
    const hex = parseInt(color.substr(1, 6), 16);
    const r = Math.round(
      Math.min(((hex & 0xff0000) >> 16) * (1 + pct), 255)
    ).toString(16);
    const g = Math.round(
      Math.min(((hex & 0x00ff00) >> 8) * (1 + pct), 255)
    ).toString(16);
    const b = Math.round(Math.min((hex & 0x0000ff) * (1 + pct), 255)).toString(
      16
    );
    return (
      "#" + ("00" + r).slice(-2) + ("00" + g).slice(-2) + ("00" + b).slice(-2)
    );
  };

  let containerStyle = styles.pad;
  containerStyle["backgroundColor"] = props.sample.color;
  if (props.selected) {
    containerStyle["backgroundColor"] = lighten(
      containerStyle["backgroundColor"],
      0.3
    );
  }

  return (
    <div>
      <div style={containerStyle} onClick={props.onClick}>
        <p style={{...styles.sampleLabel, ...styles.nonselectable}}>
          {props.sample.name}
        </p>
      </div>
      <div>
        <LoopIcon
          onClick={() => {
            props.sample.isLooping = !isLooping;
            setLooping(!isLooping);
          }}
          style={
            props.sample.isLooping
              ? {...styles.paddedIcon, ...styles.activeIcon}
              : styles.paddedIcon
          }
        />
        <TuneIcon
          style={
            props.isFxPanelOpen
              ? {...styles.paddedIcon, ...styles.activeIcon}
              : styles.paddedIcon
          }
          onClick={() => {
            props.openFXPanel();
          }}
        />
      </div>
    </div>
  );
}
