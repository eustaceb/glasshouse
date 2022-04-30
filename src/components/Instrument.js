import React, {useState, useEffect} from "react";

export function Instrument(props) {
  const padStates = {
    READY: 0,
    SCHEDULING_PLAY: 1,
    PLAYING: 2,
    SCHEDULING_STOP: 3,
  };
  const [padState, setPadState] = useState(padStates.READY);

  const sample = props.sample;
  const sampleName = sample.getName();
  console.log(sampleName);

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
  }, [props.sample]);
  return (
    <div
      className={
        props.sample.getName() +
        (playing ? " " + props.sample.getName().split(" ")[1] + "Active" : "") +
        (scheduling ? " blinking" : "")
      }
      onClick={() => {
        triggerSample();
      }}
    />
  );
}
