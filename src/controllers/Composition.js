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
  constructor(name, samples, preFx, preFxControls, fx, fxControls, volume) {
    this.name = name;
    this.samples = samples;
    this.preFx = preFx;
    this.preFxControls = preFxControls;
    this.fx = fx;
    this.fxControls = fxControls;
    this.channel = new Tone.Channel(0, 0).connect(this.fx.getNode());
    this.volume = volume;
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
}

export class Composition {
  constructor(data, sampleController) {
    this.bgSample = sampleController.getSampleByName("Sham main");
    this.bgSample.player.toDestination();

    this.sections = data.map((section, index, _) => {
      const groups = Object.entries(section["groups"]).map((kvp) => {
        const name = kvp[0];
        const groupData = kvp[1];
        const samples = groupData["samples"].map((sampleName) => {
          return sampleController.getSampleByName(sampleName);
        });

        // Indicate which group this sample belongs to for transitions
        samples.forEach((s, i) => {
          s.setGroupInfo([name, i]);
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

          const createSlider = (data) => {
            if (!("slider" in data)) return null;
            const generateRange = (from, to) =>
              Array.from({length: to - from + 1}, (_, k) => from + k);
            const sliderData = data["slider"];
            const options =
              "options" in sliderData
                ? sliderData["options"]
                : generateRange(sliderData["range"][0], sliderData["range"][1]);
            return new DiscreteControl(fx, sliderData["paramName"], options);
          };
          const sliderControl = createSlider(fxData);

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

        return new SampleGroup(
          name,
          samples,
          preFx,
          preFxControls,
          fx,
          fxControls,
          volume
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
        instruments.push({sample: sample, volume: volume});
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
