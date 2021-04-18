import * as Tone from "tone";
import React, {useState} from "react";

export function SequencerCell(props) {
  const [sampleId, setSampleId] = useState(null);
  const [active, setActive] = useState(false);
  const styles = {
    cell: {
      backgroundColor: "grey",
      width: 50,
      height: 50,
      borderRadius: 2,
    },
    active: {
      backgroundColor: "black",
    },
  };

  return (
    <div
      onClick={() => setActive(!active)}
      style={active ? {...styles.cell, ...styles.active} : styles.cell}></div>
  );
}

export function Sequencer(props) {
  const cols = 16;
  const rows = 2;
  const [grid, setGrid] = useState(Array(rows).fill(Array(cols).fill(0)));

  return (
    <table style={{"margin": "0 auto"}}>
      <tbody>
        {grid.map((row, i) => {
          return (
            <tr key={"row" + i.toString()}>
              {row.map((cell, j) => {
                return (
                  <td key={"row" + i.toString() + "col" + j.toString()}>
                    <SequencerCell />
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
