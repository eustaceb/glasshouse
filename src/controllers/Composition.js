import * as Tone from "tone";
import {FXControl, WetControl, XYControl} from "./FXControls";

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
  constructor(name, samples, preFx, fx, volume) {
    this.name = name;
    this.samples = samples;
    this.preFx = preFx;
    this.fx = fx;
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
  hasPreFx() {
    return this.preFx !== null;
  }
  getPreFx() {
    return this.preFx;
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
        const samples = kvp[1]["samples"].map((sampleName) => {
          return sampleController.getSampleByName(sampleName);
        });
        const fxData = kvp[1]["fx"];

        const fxFromData = (fxData) => {
          const fxType = fxData["type"];
          const fxLabel = fxType + " for " + name;

          // Multiparameter XY control
          if (Object.keys(fxData).includes("x")) {
            console.assert(fxData.hasOwnProperty("y"));
            return new XYControl(
              fxType,
              fxLabel,
              fxData["params"],
              fxData["x"],
              fxData["y"]
            );
          } else {
            // Dry/wet
            return new WetControl(fxData["type"], fxLabel, fxData["params"]);
          }
        };

        // Main fx
        const fx = fxFromData(fxData);

        // Pre fx (pre -> main)
        let preFx = null;
        if (Object.keys(kvp[1]).includes("preFx")) {
          preFx = fxFromData(kvp[1]["preFx"]);
        }

        // Extra control for controlling one of the params
        if (Object.keys(fxData).includes("switch")) {
          fx.addSwitch(
            fxData["switch"]["paramName"],
            fxData["switch"]["options"]
          );
        }

        // Volume control (temporary)
        const hasVolumeSetting = Object.keys(kvp[1]).includes("volume");
        const volume = new FXControl(
          "volume",
          hasVolumeSetting ? 0 : kvp[1]["volume"]
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
          hasVolumeSetting ? 0 : kvp[1]["volume"]
        );
        if (["reverb", "delay", "pingpong"].includes(fxData["type"])) {
          samples.forEach((s) => s.player.connect(dryVolume.getNode()));
        }
        dryVolume.getNode().toDestination();
        volume.registerSideChain((parameter, value) =>
          dryVolume.setParam(parameter, value)
        );

        return new SampleGroup(name, samples, preFx, fx, volume);
      });
      const instruments = section["instruments"].map((sampleName) => {
        return sampleController.getSampleByName(sampleName);
      });

      // Send instruments to master
      instruments.forEach((sample) => sample.player.toDestination());

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
