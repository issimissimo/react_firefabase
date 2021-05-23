import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import ConfirmComponent from "./ConfirmComponent";

function InputComponent(props) {
  const [value, setValue] = useState(props.value);
  const [error, setError] = useState(false);
  const onChange = (e) => {
    setValue(e.target.value);
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter") onSubmit(e);
    if (e.key === "Escape") onEscape();
  };
  const onSubmit = (e) => {
    if (value) props.onSubmit(value, e);
    else setError(true);
  };
  const onEscape = () => {
    props.onEscape();
  };
  return (
    <div>
      <TextField
        value={value}
        autoFocus={true}
        label={props.label}
        onKeyDown={(e) => onKeyDown(e)}
        onChange={onChange}
        error={error}
      />
      <ConfirmComponent onConfirm={onSubmit} onCancel={onEscape} />
    </div>
  );
}

export default InputComponent;
