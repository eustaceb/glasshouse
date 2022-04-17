import {WetControl, XYControl} from "./FXControls.js";

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
  constructor(name, samples) {
    this.name = name;
    this.samples = samples;
  }
  getName() {
    return this.name;
  }
  getSamples() {
    return this.samples;
  }
}

export class Composition {
  constructor(data, sampleController) {
    this.bgSample = sampleController.getSampleByName("Sham main");
    this.sections = data.map((section, index, _) => {
      const groups = Object.entries(section["groups"]).map((kvp) => {
        const name = kvp[0];
        const samples = kvp[1]["samples"].map((sampleName) => {
          return sampleController.getSampleByName(sampleName);
        });
        return new SampleGroup(name, samples);
      });
      const instruments = section["instruments"].map((sampleName) => {
        return sampleController.getSampleByName(sampleName);
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
