import React, { useEffect, useRef, useState } from "react";
import "./ToolBar.css";
import { Button } from "@material-ui/core";
import ModalPanel from "./ModalPanel";
import { compareSimpleObjects } from "./utils/compare";

function ToolBar(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const inputRef = useRef(null);
  const STATE = {
    CREATEFOLDER: {
      label: "Folder name",
      action: "input"
    },
    RENAME: {
      label: "New name",
      action: "input"
    },
    DELETE: {
      label: "Delete",
      action: "confirm"
    },
  };
  const state = useRef(STATE.CREATEFOLDER);

  ///
  /// open modal to delete
  ///
  const handleDeleteButton = () => {
    state.current = STATE.DELETE;
    setModalIsOpen(true);
  };

  ///
  /// open modal to rename
  ///
  const handleRenameButton = () => {
    state.current = STATE.RENAME;
    setModalIsOpen(true);
  };

  ///
  /// open modal to type the folder name
  ///
  const handleCreateFolderButton = () => {
    state.current = STATE.CREATEFOLDER;
    setModalIsOpen(true);
  };

  const handleUpload = (e) => {
    props.onUpload(Array.from(e.target.files));
  };

  const handleClickUploadBUtton = (e) => {
    inputRef.current.click();
  };

  const handleSubmitFromModal = (value) => {
    setModalIsOpen(false);

    if (compareSimpleObjects(state.current, STATE.CREATEFOLDER)) {
      props.onCreateFolder(value);
    }
    if (compareSimpleObjects(state.current, STATE.RENAME)) {
      console.log("rename");
      props.onRename(value);
    }
    if (compareSimpleObjects(state.current, STATE.DELETE)) {
      console.log("delete");
      props.onDelete();
    }
  };

  const handleEscapeFromModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="ToolBar">
      <ModalPanel
        isOpen={modalIsOpen}
        onSubmit={handleSubmitFromModal}
        onEscape={handleEscapeFromModal}
        label={state.current.label}
        selected={props.selected}
        action={state.current.action}
      />
      <div className="ToolBar-UploadButton">
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={handleClickUploadBUtton}
        >
          Upload
        </Button>
        <input
          type="file"
          multiple
          style={{ display: "none" }}
          ref={inputRef}
          onChange={handleUpload}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        onClick={handleCreateFolderButton}
      >
        Create Folder
      </Button>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        disabled={props.selected.length === 0}
        onClick={handleDeleteButton}
      >
        Delete
      </Button>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        disabled={props.selected.length !== 1}
        onClick={handleRenameButton}
      >
        Rename
      </Button>
    </div>
  );
}

export default ToolBar;
