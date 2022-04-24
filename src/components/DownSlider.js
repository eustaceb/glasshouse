import React, {useState, useEffect} from "react";
import {Slider} from "@material-ui/core";

export function DownSlider(props) {

  // position describes continuous output to control the effect
  // step describes discrete state of the slider

  const minStep = parseInt(props.minStep)
  const maxStep = parseInt(props.maxStep)
  const minPosition = parseInt(props.minPosition)
  const maxPosition = parseInt(props.maxPosition)
  const initialPosition = parseInt(props.initialPosition)
  const initialStep = parseInt(props.initialStep)
  const className = props.className

  const [step, setStep] = useState(initialStep);
  const [position, setPosition] = useState(initialPosition);
  const [mouseDown, setMouseDown] = useState(false);

  const handleMouseDown = (event) => {
    setMouseDown(true);
    // console.log(1);
  };

  const handleMouseUp = (event) => {
    setMouseDown(false);
    // console.log(0);
  };

  const handleMouseMove = (event) => {

    if(mouseDown) {
      let nextPosition = position + event.movementY;
      nextPosition = Math.max(Math.min(maxPosition, nextPosition), minPosition);

      props.callback(nextPosition);
      setPosition(nextPosition);
      setStep(Math.trunc(position / maxPosition * maxStep));
      console.log(position)
    }
  };


  return (
    <div 
      className={className + " " + className + "_" + step}
      onMouseDown={ handleMouseDown } 
      onMouseUp={ handleMouseUp }
      onMouseMove={handleMouseMove}
    ></div>
  );
}