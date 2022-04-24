import React, {useState, useEffect} from "react";
import {DownSlider} from "./DownSlider.js"
export function ComponentA(props) {


  return (
    <div className={"component componentA"}>
      <div className={"vocal vocal1_s1"}></div>
      <div className={"vocal vocal2_s1"}></div>
      <div className={"vocal vocal3_s1"}></div>
      <DownSlider
        minStep="0"
        maxStep="7"
        minPosition="0"
        maxPosition="100"
        initialPosition="40"
        initialStep="2"
        className="downSlider1" ></DownSlider>
    </div>
  )
}
