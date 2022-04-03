import React from "react";
import {ArrowBack, ArrowForward} from "@material-ui/icons";

export function Navigation(props) {
  const sectionIndex = props.sectionIndex;
  return (
    <div style={{width: "100%", textAlign: "center"}}>
      {sectionIndex > 0 ? (
        <ArrowBack
          style={{float: "left"}}
          onClick={() => props.setSection(sectionIndex - 1)}
        />
      ) : (
        ""
      )}
      <span>{props.sectionName}</span>
      {sectionIndex < props.sectionCount - 1 ? (
        <ArrowForward
          style={{float: "right"}}
          onClick={() => props.setSection(sectionIndex + 1)}
        />
      ) : (
        ""
      )}
    </div>
  );
}
