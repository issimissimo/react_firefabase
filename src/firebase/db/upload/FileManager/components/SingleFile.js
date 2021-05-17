import React, { useState, useEffect, useRef } from "react";
import FolderIcon from "@material-ui/icons/Folder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import "./SingleFile.css";

function SingleFile(props) {
  const handleDoubleClick = () => {
    props.onDoubleClick(props.item);
  };

  const icon = props.item.isFolder ? (
    <FolderIcon style={{ fontSize: 60 }} />
  ) : (
    <InsertDriveFileIcon />
  );

  return (
    <div className="SingleFile" onDoubleClick={handleDoubleClick}>
      {icon}
      <span>{props.item.key}</span>
    </div>
  );
}

export default SingleFile;
