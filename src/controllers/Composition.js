import * as Tone from "tone";
import {
  DiscreteControl,
  FXControl,
  ContinuousControl,
  XYControl,
} from "./FXControls";

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
  getGroups() {
    return Object.values(this.groups);
  }
}

class SampleGroup {
  constructor(
    name,
    samples,
    preFx,
    fx,
    fxControls,
    volume,
    componentDescription
  ) {
    this.name = name;
    this.samples = samples;
    this.preFx = preFx;
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
  getPreFx() {
    return this.preFx;
  }
  getFx() {
    return this.fx;
  }
  getFxControls() {
    return this.fxControls;
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
    const bgVolume = new FXControl(
      "volume",
      "volume",
      4 // +4db to background sample
    );
    this.bgSample.getPlayer().connect(bgVolume.getNode());
    bgVolume.getNode().toDestination();

    this.sections = data.map((section, index, _) => {
      const groups = Object.entries(section["groups"]).map((kvp) => {
        const name = kvp[0];
        const groupData = kvp[1];
        const samples = groupData["samples"].map((sampleName) => {
          return sampleController.getSampleByName(sampleName);
        });

        const preFxData = "preFx" in groupData ? groupData["preFx"] : null;
        const fxData = groupData["fx"];
        const postFxData = "postFx" in groupData ? groupData["postFx"] : null;

        const fxFromData = (fxData) => {
          const fxType = fxData["type"];
          const fxLabel = fxType + " for " + name;
          const fxParams = fxData["params"];
          return new FXControl(fxType, fxLabel, fxParams);
        };

        const createControls = (preFx, fx, postFx, description) => {
          const sources = {
            fx: fx,
            preFx: preFx,
            postFx: postFx,
          };
          let xyControl = null;
          if ("xyPad" in description) {
            const xAxisDesc = description["xyPad"]["xAxis"];
            const yAxisDesc = description["xyPad"]["yAxis"];
            const xSource = sources[xAxisDesc.source];
            const ySource = sources[yAxisDesc.source];
            xyControl = new XYControl(xSource, ySource, xAxisDesc, yAxisDesc);
          }

          // Only one slider per component
          let sliderControl = null;
          if ("downSlider" in description) {
            const sliderData = description["downSlider"];
            const source = sources[sliderData["source"]];
            if ("options" in sliderData) {
              sliderControl = new DiscreteControl(
                source,
                sliderData["paramName"],
                sliderData["options"]
              );
            } else {
              sliderControl = new ContinuousControl(
                source,
                sliderData["paramName"]
              );
            }
          }

          let switchControl = null;
          if ("switch" in description) {
            const switchData = description["switch"];
            const source = sources[switchData["source"]];
            switchControl = new DiscreteControl(
              source,
              switchData["paramName"],
              switchData["options"]
            );
          }
          return {
            xy: xyControl,
            switch: switchControl,
            slider: sliderControl,
          };
        };

        // Create FX controls based on component descriptions
        const desc = groupData["componentDescription"];
        let downSliderDescription = null;
        let xyPadDescription = null;
        let multistateSwitch = null;

        if ("downSlider" in desc) {
          const downSliderDesc = desc["downSlider"];
          downSliderDescription = new DownSliderDescription(
            downSliderDesc["className"] ?? "downSlider1",
            downSliderDesc["steps"] ?? 7
          );
        }

        if ("xyPad" in desc) {
          const xyPadDesc = desc["xyPad"];
          xyPadDescription = new XYPadDescription(
            xyPadDesc["boxClassName"] ?? "xyPad",
            xyPadDesc["trackerClassName"] ?? "tracker"
          );
        }

        const componentDescription = new ComponentDescription(
          desc["className"] ?? "compponent componentA",
          downSliderDescription,
          xyPadDescription,
          multistateSwitch
        );

        const fx = fxFromData(fxData);
        const preFx = preFxData ? fxFromData(preFxData) : null;
        const postFx = postFxData ? fxFromData(postFxData) : null;
        const fxControls = createControls(preFx, fx, postFx, desc);

        const groupVolume = "volume" in groupData ? groupData["volume"] : 0;
        const volume = new FXControl("volume", "volume", groupVolume);

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
        if (postFx !== null) {
          fx.getNode().connect(postFx.getNode());
          postFx.getNode().toDestination();
        } else {
          fx.getNode().toDestination();
        }

        // Send dry signal to master alongside the wet for time based fx
        const dryVolume = new FXControl("volume", "volume", groupVolume);
        if (["reverb", "delay", "pingpong"].includes(fxData["type"])) {
          samples.forEach((s) => s.player.connect(dryVolume.getNode()));
        }

        // Note: Post FX applies to the dry channel as well as it's usually just a filter
        if (postFx !== null) {
          dryVolume.getNode().connect(postFx.getNode());
        } else {
          dryVolume.getNode().toDestination();
        }

        volume.registerSideChain((parameter, value) =>
          dryVolume.setParam(parameter, value)
        );

        return new SampleGroup(
          name,
          samples,
          preFx,
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
        const volume = new FXControl(
          "volume",
          "volume",
          instrumentData["volume"]
        );
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

  startFx() {
    /** Run after AudioContext is running */
    this.sections.forEach((s) => {
      s.getGroups().forEach((g) => {
        g.getPreFx() ? g.getPreFx().start() : null;
        g.getFx() ? g.getFx().start() : null;
      });
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
