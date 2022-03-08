class CompositionCell {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
  }
  isSample() {
    return this.hasOwnProperty("sample");
  }
  isFx() {
    return this.hasOwnProperty("fx");
  }
}

export class SampleCell extends CompositionCell {
  constructor(sample, rows, cols) {
    super(rows, cols);
    this.sample = sample;
  }
  getColor() {
    return this.sample.color;
  }
  getName() {
    return this.sample.name;
  }
}

export class FxCell extends CompositionCell {
  constructor(fx, rows, cols) {
    super(rows, cols);
    this.fx = fx;
  }
  getColor() {
    return this.fx.color;
  }
  getName() {
    return this.fx.displayName;
  }
}
