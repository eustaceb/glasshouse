export class ArrangementController {
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
