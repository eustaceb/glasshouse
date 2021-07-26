export function LabeledCheckbox(props) {
  const checkbox = <Checkbox onChange={props.onChange} />;
  return <FormControlLabel control={checkbox} label={props.label} />;
}
