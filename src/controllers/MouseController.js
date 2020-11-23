export class MouseController {
  constructor(document) {
    console.log("Instantiated mouse controller");
    this.listeners = {
      mouseDown: new Map(),
      mouseMove: new Map(),
      mouseUp: new Map(),
      mouseLeave: new Map(),
    };
    this.isDragging = false;
    this.dragStart = 0;

    document.addEventListener("mousemove", (e) => this.mouseMove(e));
    document.addEventListener("mousedown", (e) => this.mouseDown(e));
    document.addEventListener("mouseup", (e) => this.mouseUp(e));
    document.addEventListener("mouseleave", (e) => this.mouseLeave(e));
  }

  /**
   * Registers a mouse event listener for a particular event type
   * @param {Object} obj Object to register
   * @param {string} eventType Name of event, must be one of "mouseDown" "mouseMove", "mouseUp", "mouseLeave"
   * @callback callback Function that will be called when that particular event is triggered
   */
  registerListener(componentId, eventType, callback) {
    this.listeners[eventType].set(componentId, callback);
  }

  removeListener(componentId, eventType) {
    delete this.listeners[eventType][componentId];
  }

  mouseDown(event) {
    event.preventDefault();

    this.isDragging = true;
    this.dragStart = [event.clientX, event.clientY];

    this.listeners["mouseDown"].forEach((callback) => {
      callback(event);
    });
  }

  mouseMove(event) {
    event.preventDefault();

    this.listeners["mouseMove"].forEach((callback) => {
      event.isDragging = this.isDragging;
      event.dragStart = this.dragStart;
      callback(event);
    });
  }

  mouseUp(event) {
    event.preventDefault();
    this.listeners["mouseUp"].forEach((callback) => {
      callback(event);
    });
    this.isDragging = false;
  }

  mouseLeave(event) {
    event.preventDefault();
    this.listeners["mouseLeave"].forEach((callback) => {
      callback(event);
    });
    this.isDragging = false;
  }
}
