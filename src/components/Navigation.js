import React, {useState} from "react";
import {ArrowBack, ArrowForward} from "@material-ui/icons";

export function Navigation(props) {
  const page = props.page;
  return (
    <div style={{width: "100%", textAlign: "center"}}>
      {page > 0 ? (
        <ArrowBack
          style={{float: "left"}}
          onClick={() => props.setPage(page - 1)}
        />
      ) : (
        ""
      )}
      <span>{props.pageName}</span>
      {page < props.pageCount - 1 ? (
        <ArrowForward
          style={{float: "right"}}
          onClick={() => props.setPage(page + 1)}
        />
      ) : (
        ""
      )}
    </div>
  );
}
