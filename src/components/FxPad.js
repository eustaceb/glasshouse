import React, {useState} from "react";
import {AlbumTwoTone} from "@material-ui/icons";

export function FxPad(props) {
  const [isActive, setActive] = useState(false);
  const cell = props.cell;

  return (
    <div
      style={{backgroundColor: cell.getColor(), position: "relative"}}
      onClick={() => setActive(!isActive)}
      className={isActive ? "pad fillHeight blinkingSlow" : "pad fillHeight"}>
      <div style={{padding: "1%"}}>
        <p className="sampleLabel">{cell.getName()}</p>
        <p style={{textAlign: "center"}}>
          <AlbumTwoTone />
        </p>
      </div>
    </div>
    // <div>
    //   <div
    //     style={{backgroundColor: props.sample.color, position: "relative"}}
    //     onClick={() => triggerSample()}
    //     className={ padState === padStates.SCHEDULING ? "pad blinking" : "pad"}>
    //     <div style={{position: "relative"}}>
    //       <div className={padState === padStates.PLAYING ? "beatStrip" : ""} />
    //     </div>
    //     <div style={{padding: "1%"}}>
    //       <p className="sampleLabel">{props.sample.name} [{props.sample.duration}]</p>
    //       <p style={{textAlign: "center"}}>{padState === padStates.PLAYING && <VolumeUpIcon />}</p>
    //     </div>
    //   </div>
    //   <div style={{textAlign: "center"}}>
    //     <LoopIcon
    //       className={
    //         "paddedIcon" + (props.sample.type == "loop" ? " activeIcon" : "")
    //       }
    //     />
    //     <TuneIcon
    //       className={"paddedIcon" + (props.isFxPanelOpen ? " activeIcon" : "")}
    //       onClick={() => {
    //         props.openFXPanel();
    //       }}
    //     />
    //   </div>
    // </div>
  );
}
