import {DiscreteSlider} from "./DiscreteSlider.js";
import {KnobControl} from "./KnobControl.js";
import {MultistateSwitch} from "./MultistateSwitch.js";
import {XYPad} from "./XYPad.js";

export function SampleGroup(props) {
    const volume = props.group.getVolume();
    const mouseController = props.mouseController;
  
    const playSample = (sampleIndex) => {
      // Stop other samples in group
      props.group.getSamples().forEach((s) => {
        if (sampleIndex !== s.id && s.isPlaying()) props.stopSample(s.id);
      });
      props.playSample(sampleIndex);
    };

    const pads = props.group.getSamples().map((s) => (
      <TableCell key={s.id}>
        <SamplePad
          className="fillHeight"
          sample={s}
          playSample={() => playSample(s.id)}
          stopSample={() => props.stopSample(s.id)}
        />
      </TableCell>
    ));

    const generateFxComponents = (controls) => {
      if (controls === null) return null;
      let fxComponents = Array();
      if (controls["xy"] !== null) {
        const fx = controls["xy"];
        fxComponents.push(
          <XYPad
            size={100}
            label={fx.getLabel()}
            labelX={fx.getLabelX()}
            labelY={fx.getLabelY()}
            mouseController={mouseController}
            fx={fx}
            callbackX={(val) => fx.setX(val / 100.0)}
            callbackY={(val) => fx.setY(val / 100.0)}
          />
        );
      }
      if (controls["wet"] !== null) {
        const fx = controls["wet"];
        fxComponents.push(
          <KnobControl
            size={50}
            label={fx.getLabel()}
            minValue={0}
            maxValue={100}
            mouseController={mouseController}
            callback={(val) => fx.setWet(val / 100)}
          />
        );
      }
      if (controls["switch"] !== null) {
        const fx = controls["switch"];
        fxComponents.push(
          <MultistateSwitch
            label={fx.getParamName()}
            initialSelection={0}
            optionLabels={fx.getValues().map((v) => v.toString())}
            optionCallback={(v) => fx.setValue(v)}
          />
        );
      }
      if (controls["slider"] !== null) {
        const fx = controls["slider"];
        fxComponents.push(
          <DiscreteSlider
            label={fx.getParamName()}
            initialValue={0}
            marks={fx.getValues().map((v) => {
              return ({value: v, label: v.toString()});
            })}
            callback={(v) => fx.setValue(v)}
          />
        );
      }
      return fxComponents.map((c, i) => <TableCell key={i}>{c}</TableCell>);
    };

    const preFxComponents = generateFxComponents(props.group.getPreFxControls());
    const fxComponents = generateFxComponents(props.group.getFxControls());

    return (
      <TableRow>
        <TableCell>{props.group.getName()}</TableCell>
        {pads}
        {preFxComponents}
        {fxComponents}
        <TableCell>
          <VolumeSlider volume={volume} />
        </TableCell>
      </TableRow>
    );
  }
