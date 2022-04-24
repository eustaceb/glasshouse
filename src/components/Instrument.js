import React, {useState, useEffect} from "react";

export function Instrument(props) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  const padStates = {
    READY: 0,
    SCHEDULING_PLAY: 1,
    PLAYING: 2,
    SCHEDULING_STOP: 3,
  };
  const [padState, setPadState] = useState(padStates.READY);

  const sample = props.sample;
  const scheduling =
    padState === padStates.SCHEDULING_PLAY ||
    padState === padStates.SCHEDULING_STOP;
  const playing =
    padState === padStates.SCHEDULING_STOP || padState === padStates.PLAYING;

  const shape = props.shape;

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
  }, [props.sample]);
  // const htmlMap = (
  //   <map name="image-map">
  //     <area
  //       shape="rect"
  //       coords="0, 0,125, 125"
  //       href="#"
  //     />
  //   </map>
  // );
  return (
    <div
      className={
        "instrument " + 
        ((active ? props.name + "Active" : props.name) + (hover ? "Hover" : ""))
      }
      onClick={() => {
        console.log(`We'd be playing ${props.name} now`);
        triggerSample();
        setActive(!active);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style= {{clipPath:shape}}
    />
  );
}
