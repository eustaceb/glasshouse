import * as Tone from "tone";
import React, {useEffect, useState, useRef} from "react";

class Arrangement {
  constructor(rows, cols) {
    this.matrix = Array.from({length: rows}, () =>
      Array.from({length: cols}, () => -1)
    );
  }
  paintCell(row, col, sampleIndex) {
    console.log(row, col, sampleIndex);
    this.matrix[row][col] =
      this.matrix[row][col] == sampleIndex ? -1 : sampleIndex;
  }
}

export function SequencerCell(props) {
  const styles = {
    cell: {
      width: 50,
      height: 50,
      borderRadius: 2,
    },
    active: {
      border: "5px",
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
                        console.log(i, j, props.selectedSampleIndex);
                        props.arrangement.paintCell(
                          i,
                          j,
                          props.selectedSampleIndex
                        );
                        console.log(props.arrangement.matrix);
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
  const [beat, setBeat] = useState(0);
  const [arrangement, setArrangement] = useState(new Arrangement(rows, cols));
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
    };
    sequencer.current.events = [0, 1, 2, 3, 4, 5, 6, 7];
    sequencer.current.time = "8n";

    console.log("Starting sequencer");
    sequencer.current.start(0);
    return () => {
      console.log("Stopping sequencer");
      seq.stop();
    };
  }, [synths, arrangement]);

  return (
    <SequencerGrid
      arrangement={arrangement}
      selectedSampleIndex={props.selectedSampleIndex}
      samples={props.samples}
    />
  );
}
