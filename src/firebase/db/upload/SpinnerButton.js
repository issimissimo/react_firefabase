import React, { useState, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./SpinnerButton.css"

function SpinnerButton(props) {
  const [state, setState] = useState("button");

  let item;
  if (state === "button") {
    item = (
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          props.onClick();
          setState("spinner");
        }}
      >
        {props.label}
      </Button>
    );
  } else if (state === "spinner") item = <CircularProgress />;

  return <div className="SpinnerButton">{item}</div>;
}

export default SpinnerButton;
