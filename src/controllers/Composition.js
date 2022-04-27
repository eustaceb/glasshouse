import * as Tone from "tone";
import {DiscreteControl, FXControl, WetControl, XYControl} from "./FXControls";

export class Section {
  /**
   * Represents a song section
   * @param {Array} bgSamples Background samples
   * @param {Array} fgSamples Foreground samples
   * @param {Array} effects List of FX in section
   */
  constructor(name, groups, instruments) {
    this.name = name;
    this.groups = {};
    groups.forEach((group) => {
      this.groups[group.getName()] = group;
    });
    this.instruments = instruments;
  }
  getName() {
    return this.name;
  }
  getInstruments() {
    return this.instruments;
  }
  hasGroup(groupName) {
    return groupName in this.groups;
  }
  getGroup(groupName) {
    return this.groups[groupName];
  }
}

class SampleGroup {
  constructor(
    name,
    samples,
    preFx,
    preFxControls,
    fx,
    fxControls,
    volume,
    componentDescription
  ) {
    this.name = name;
    this.samples = samples;
    this.preFx = preFx;
    this.preFxControls = preFxControls;
    this.fx = fx;
    this.fxControls = fxControls;
    this.channel = new Tone.Channel(0, 0).connect(this.fx.getNode());
    this.volume = volume;
    this.componentDescription = componentDescription;
  }
  getName() {
    return this.name;
  }
  getSamples() {
    return this.samples;
  }
  getFx() {
    return this.fx;
  }
  getFxControls() {
    return this.fxControls;
  }
  hasPreFx() {
    return this.preFx !== null;
  }
  getPreFx() {
    return this.preFx;
  }
  getPreFxControls() {
    return this.preFxControls;
  }
  getVolume() {
    return this.volume;
  }
  getComponentDescription() {
    return this.componentDescription;
  }
}

class DownSliderDescription {
  constructor(className, steps) {
    this.className = className;
    this.steps = steps;
  }
  getClassName() {
    return this.className;
  }
  getSteps() {
    return this.steps;
  }
}

class XYPadDescription {
  constructor(boxClassName, trackerClassName) {
    this.boxClassName = boxClassName;
    this.trackerClassName = trackerClassName;
  }
  getBoxClassName() {
    return this.boxClassName;
  }
  getTrackerClassName() {
    return this.trackerClassName;
  }
}

class ComponentDescription {
  constructor(
    className,
    downSliderDescription,
    xyPadDescription,
    multistateSwitchDescription
  ) {
    this.className = className;
    this.downSliderDescription = downSliderDescription;
    this.xyPadDescription = xyPadDescription;
    this.multistateSwitchDescription = multistateSwitchDescription;
  }

  getClassName() {
    return this.className;
  }

  getDownSliderDescription() {
    return this.downSliderDescription;
  }

  getXYPadDescription() {
    return this.xyPadDescription;
  }

  getMultistateSwitchDescription() {
    return this.multistateSwitchDescription;
  }
}

export class Composition {
  constructor(data, sampleController) {
    this.bgSample = sampleController.getSampleByName("Sham_main");
    this.bgSample.player.toDestination();

    this.sections = data.map((section, index, _) => {
      const groups = Object.entries(section["groups"]).map((kvp) => {
        const name = kvp[0];
        const groupData = kvp[1];
        const samples = groupData["samples"].map((sampleName) => {
          return sampleController.getSampleByName(sampleName);
        });

        const preFxData = "preFx" in groupData ? groupData["preFx"] : null;
        const fxData = groupData["fx"];

        const fxFromData = (fxData) => {
          const fxType = fxData["type"];
          const fxLabel = fxType + " for " + name;
          const fxParams = fxData["params"];
          return new FXControl(fxType, fxLabel, fxParams);
        };

        const createControls = (fx, fxData) => {
          const xyControl =
            "x" in fxData ? new XYControl(fx, fxData["x"], fxData["y"]) : null;

          // @TODO: There's no real reason for xyControl to be mutually exclusive with xyControl, remove this
          const wetControl = xyControl ? null : new WetControl(fx);

          const switchControl =
            "switch" in fxData
              ? new DiscreteControl(
                  fx,
                  fxData["switch"]["paramName"],
                  fxData["switch"]["options"]
                )
              : null;
          const generateRange = (from, to) =>
            Array.from({length: to - from + 1}, (_, k) => from + k);
          const sliderControl =
            "slider" in fxData
              ? new DiscreteControl(
                  fx,
                  fxData["slider"]["paramName"],
                  generateRange(
                    fxData["slider"]["range"][0],
                    fxData["slider"]["range"][1]
                  )
                )
              : null;
          return {
            wet: wetControl,
            xy: xyControl,
            switch: switchControl,
            slider: sliderControl,
          };
        };

        const fx = fxFromData(fxData);
        const fxControls = createControls(fx, fxData);
        const preFx = preFxData ? fxFromData(preFxData) : null;
        const preFxControls = preFx ? createControls(preFx, preFxData) : null;

        // Volume control (temporary)
        const volume = new FXControl(
          "volume",
          "volume",
          "volume" in groupData ? 0 : groupData["volume"]
        );

        // Do the wiring
        // Each sample into the volume node
        samples.forEach((s) => {
          s.getPlayer().connect(volume.getNode());
        });

        // preFx -> fx if preFx exists
        if (preFx !== null) {
          // Volume node into the fx node
          volume.getNode().connect(preFx.getNode());
          preFx.getNode().connect(fx.getNode());
        } else {
          volume.getNode().connect(fx.getNode());
        }
        // Fx node to master
        fx.getNode().toDestination();

        // Send dry signal to master alongside the wet for time based fx
        const dryVolume = new FXControl(
          "volume",
          "volume",
          volume in groupData ? 0 : groupData["volume"]
        );
        if (["reverb", "delay", "pingpong"].includes(fxData["type"])) {
          samples.forEach((s) => s.player.connect(dryVolume.getNode()));
        }
        dryVolume.getNode().toDestination();
        volume.registerSideChain((parameter, value) =>
          dryVolume.setParam(parameter, value)
        );

        let componentDescription = null;
        if ("componentDescription" in groupData) {
          const desc = groupData["componentDescription"];
          let downSliderDescription = null;
          let xyPadDescription = null;
          let multistateSwitch = null;

          if ("downSlider" in desc) {
            const downSliderDesc = desc["downSlider"];
            downSliderDescription = new DownSliderDescription(
              downSliderDesc["className"] ?? "downSlider1",
              downSliderDesc["steps"] ?? 7,
            );
          }

          if ("xyPad" in desc) {
            const xyPadDesc = desc["xyPad"];
            xyPadDescription = new XYPadDescription(
              xyPadDesc["boxClassName"] ?? "xyPad",
              xyPadDesc["trackerClassName"] ?? "tracker",
            );
          }

          componentDescription = new ComponentDescription(
            desc["className"] ?? "compponent componentA",
            downSliderDescription,
            xyPadDescription,
            multistateSwitch
          );
        }
        return new SampleGroup(
          name,
          samples,
          preFx,
          preFxControls,
          fx,
          fxControls,
          volume,
          componentDescription
        );
      });

      // Construct instruments
      const instruments = new Array();
      section["instruments"].forEach((instrumentData) => {
        const sample = sampleController.getSampleByName(
          instrumentData["sample"]
        );
        const volume = new FXControl("volume", instrumentData["volume"]);
        sample.getPlayer().connect(volume.getNode());
        volume.getNode().toDestination();
        instruments.push(sample);
      });

      return new Section(
        "Section " + (index + 1).toString(),
        groups,
        instruments
      );
    });
  }

  getSectionCount() {
    return this.sections.length;
  }

  getSection(index) {
    console.assert(
      index >= 0 && index < this.sections.length,
      `Requested section ${index} does not exist`
    );
    return this.sections[index];
  }
}
