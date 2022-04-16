import React, {useState, useEffect} from "react";
import {useLocalContext} from "../utils/ReactHelpers.js";
import {uuidv4} from "../utils/GUID.js";

export function DownSlider(props) {

  const [position, setPosition] = useState(0);
  const [state, setState] = useState(0);
  const [mouseDown, setMouseDown] = useState(false);


  const handleMouseDown = (event) => {
    setMouseDown(true);
    console.log(1);
  };

  const handleMouseUp = (event) => {
    setMouseDown(false);
    console.log(0);
  };

  const handleMouseMove = (event) => {
    if(mouseDown) {
      let nextPosition = position + event.movementY;
      nextPosition = Math.max(Math.min(140, nextPosition), 0);

      setPosition(nextPosition);
      setState(Math.trunc(position / 140 * 7));
      console.log(state)
    }
  };

  return (
    <div className="centered">
      <div 
        style={{backgroundColor: '#337ab7',  display:"inline-block", position:"relative"}} 
        onMouseDown={ handleMouseDown } 
        onMouseUp={ handleMouseUp }
        onMouseMove={handleMouseMove}>
        <img src="images/down_slider_circular/slider-1.png" style = {{position: "relative", top: 0, left: 0}}/>
        {state > 0 &&
          <img src="images/down_slider_circular/slider-2.png" style = {{position: "absolute", top: 0, left: 0}}/>
        }
        {state > 1 &&
          <img src="images/down_slider_circular/slider-3.png" style = {{position: "absolute", top: 0, left: 0}}/>
        }
        {state > 2 &&
          <img src="images/down_slider_circular/slider-4.png" style = {{position: "absolute", top: 0, left: 0}}/>
        }
        {state > 3 &&
          <img src="images/down_slider_circular/slider-5.png" style = {{position: "absolute", top: 0, left: 0}}/>
        }
        {state > 4 &&
          <img src="images/down_slider_circular/slider-6.png" style = {{position: "absolute", top: 0, left: 0}}/>
        }
        {state > 5 &&
          <img src="images/down_slider_circular/slider-7.png" style = {{position: "absolute", top: 0, left: 0}}/>
        }
        {state > 6 &&
          <img src="images/down_slider_circular/slider-8.png" style = {{position: "absolute", top: 0, left: 0}}/>
        }
      </div>
    </div>
  );
}
