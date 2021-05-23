import React, { useState, useEffect, useRef } from "react";
import "./SimpleInputText.css";

function SimpleInputText(props) {
  const [value, setValue] = useState(props.value);
  const onChangeText = (e) => {
    setValue(e.target.value);
  };
  const onFocus = (e) => e.target.select();
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      document.activeElement.blur()
    }
  };
  const onBlur = () => {
    returnValue();
  };
  const returnValue = () => {
    props.onSubmit(value)
  };
  return (
    <input
      className="SimpleInputText"
      type="text"
      value={value}
      onChange={onChangeText}
      autoFocus
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      spellCheck="false"
    ></input>
  );
}

export default SimpleInputText;
