import * as Tone from "tone";
import React, {useState} from "react";

export function SequencerCell(props) {
  const styles = {
    cell: {
      width: 50,
      height: 50,
      borderRadius: 2,
    },
  };

  return (
    <div
      onClick={() => props.paint()}
      style={{...styles.cell, "backgroundColor": props.color}}></div>
  );
}

export function Sequencer(props) {
  const cols = 16;
  const rows = 2;
  const [grid, setGrid] = useState(Array(rows).fill(Array(cols).fill(-1)));

  function paintCell(row, col, sampleIndex) {
    setGrid(
      grid.map((gridRow, i) => {
        return gridRow.map((gridCell, j) => {
          if (i === row && j === col) {
            if (gridCell === sampleIndex) return -1;
            else return sampleIndex;
          }
          return gridCell;
        });
      })
    );
  }

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
                      paint={() => paintCell(i, j, props.selectedSampleIndex)}
                      color={ cell === -1 ? "grey" : props.samples[cell]["color"]}
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
