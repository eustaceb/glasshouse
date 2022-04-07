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
    this.target = null;

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
    console.log(`Registering listener ${componentId} ${eventType}`);
    this.listeners[eventType].set(componentId, callback);
  }

  removeListener(componentId, eventType) {
    console.log(`Removing listener ${componentId} ${eventType}`);
    delete this.listeners[eventType][componentId];
  }

  mouseDown(event) {
    event.preventDefault();

    this.isDragging = true;
    this.dragStart = [event.clientX, event.clientY];
    this.target = event.target;

    this.listeners["mouseDown"].forEach((callback) => {
      event.rect = this.target.getBoundingClientRect();
      callback(event);
    });
  }

  mouseMove(event) {
    event.preventDefault();

    this.listeners["mouseMove"].forEach((callback) => {
      event.isDragging = this.isDragging;
      event.dragStart = this.dragStart;
      event.rect = this.target.getBoundingClientRect();
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
