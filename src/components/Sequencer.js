import * as Tone from "tone";
import React, {useEffect, useState, useRef} from "react";
import {ArrangementController} from "../controllers/ArrangementController.js"

export function SequencerCell(props) {
  const styles = {
    cell: {
      width: 50,
      height: 50,
      borderRadius: 2,
    },
    active: {
      padding: "5px",
    },
  };

  return (
    <div
      onClick={() => props.paint()}
      style={
        props.active
          ? {...styles.cell, ...styles.active, backgroundColor: props.color}
          : {...styles.cell, backgroundColor: props.color}
      }></div>
  );
}


export function SequencerGrid(props) {
  const [grid, setGrid] = useState(props.arrangement.matrix);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    props.playback.setBeatCallback((n) => setBeat(n));
  }, [beat, props.playback]);

  return (
    <table style={{margin: "0 auto"}}>
      <tbody>
        {grid.map((row, i) => {
          return (
            <tr key={"row" + i.toString()}>
              {row.map((cell, j) => {
                return (
                  <td key={"row" + i.toString() + "col" + j.toString()}>
                    <SequencerCell
                      paint={() => {
                        props.arrangement.paintCell(
                          i,
                          j,
                          props.selectedSample
                        );
                        setGrid([...props.arrangement.matrix]);
                      }}
                      color={
                        cell === -1 ? "grey" : props.samples[cell]["color"]
                      }
                      active={beat === j}
                    />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function Sequencer(props) {
  const cols = 16;
  const rows = 2;
  const [arrangement, setArrangement] = useState(new ArrangementController(rows, cols));
  const synths = useRef(Array(rows).fill(new Tone.Synth().toDestination()));
  const sequencer = useRef(new Tone.Sequence());

  useEffect(() => {
    const seq = sequencer.current;

    sequencer.current.callback = (time, column) => {
      arrangement.matrix.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (j === column && cell !== -1) {
            synths.current[i].triggerAttackRelease("C4", "8n", time);
          }
        });
      });
      props.playback.setBeat(column);
    };
    sequencer.current.events = Array.from(Array(16).keys()); // 0 to 15
    sequencer.current.time = "1n";

    console.log("Starting sequencer");
    sequencer.current.start(0);
    return () => {
      console.log("Stopping sequencer");
      seq.stop();
    };
  }, [synths, arrangement, props.playback]);

  return (
    <SequencerGrid
      arrangement={arrangement}
      selectedSample={props.selectedSample}
      samples={props.samples}
      playback={props.playback}
    />
  );
}
