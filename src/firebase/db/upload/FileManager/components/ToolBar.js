import React, { useEffect } from "react";
import "./ToolBar.css";
import { Button } from "@material-ui/core";

function ToolBar(props) {
  const handleDeleteClick = () => {
      props.onDelete();
  };

  const handleDeleteFolder = () =>{
      props.onCreateFolder();
  }

  return (
    <div className="ToolBar">
      <Button
        variant="contained"
        color="primary"
        disableElevation
        onClick={handleDeleteFolder}
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
