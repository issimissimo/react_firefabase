import React, { useEffect } from "react";
import "./ToolBar.css";
import { Button } from "@material-ui/core";

function ToolBar(props) {
  const handleDeleteClick = () => {
      props.onClickDelete();
  };

  return (
    <div className="ToolBar">
      <Button
        variant="contained"
        color="primary"
        disableElevation
        onClick={handleDeleteClick}
      >
        Create Folder
      </Button>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        disabled={props.selected.length === 0}
        onClick={handleDeleteClick}
      >
        Delete
      </Button>
    </div>
  );
}

export default ToolBar;
