import React, {createRef, useState, useEffect} from "react";


function findAnimByName(elem, name) {
  const anims = elem.getAnimations();
  return anims.find((anim) => anim.animationName === name);
}

export function Instrument(props) {
  const padStates = {
    READY: 0,
    SCHEDULING_PLAY: 1,
    PLAYING: 2,
    SCHEDULING_STOP: 3,
  };
  const [padState, setPadState] = useState(padStates.READY);

  const dom = createRef();
  const sample = props.sample;

  const scheduling =
    padState === padStates.SCHEDULING_PLAY ||
    padState === padStates.SCHEDULING_STOP;
  const playing =
    padState === padStates.SCHEDULING_STOP || padState === padStates.PLAYING;

  const triggerSample = () => {
    if (sample.isInactive()) {
      // Register end playback callback that will rerender this UI if not looping
      sample.setEndPlaybackCallback(() => setPadState(padStates.READY));
      sample.setStartPlaybackCallback(() => setPadState(padStates.PLAYING));
      props.playSample();
      setPadState(padStates.SCHEDULING_PLAY);
    } else if (sample.isPlaying()) {
      props.stopSample();
      setPadState(padStates.SCHEDULING_STOP);
    }
  };

  useEffect(() => {
    // Reset pad state if sample changes
    setPadState(padStates.READY);

    // Synchronise instrument pulse animations
    dom.current ? dom.current.addEventListener("animationstart", (evt) => {
    if (evt.animationName === "pulse") {
      const thisAnim = findAnimByName(evt.target, "pulse");
      const allInstruments = document.getElementsByClassName("instrument");
      for (let i = 0; i < allInstruments.length; i++) {
        const otherAnim = findAnimByName(allInstruments[i], "pulse");
        if (otherAnim && (otherAnim !== thisAnim)) {
          thisAnim.startTime = otherAnim.startTime;
          break;
        }
      }
    }
  }) : null;

  }, [props.sample]);
  return (
    <div
    ref={dom}
      className={
        props.sample.getName() +
        ((playing || scheduling) ? " " + props.sample.getName().split(" ")[1] + "Active" : "") +
        (scheduling ? " blinking" : "")
      }
      onClick={() => {
        triggerSample();
      }}
    />
  );
}
