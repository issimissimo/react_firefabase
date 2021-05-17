import React, { useState, useEffect, useRef } from "react";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import "./SingleFile.css";

function SingleFile(props) {
  const handleDoubleClick = () => {
    props.onDoubleClick(props.item);
  };

  const icon = props.item.isFolder ? (
    <FolderOpenOutlinedIcon style={{ fontSize: 70 }} />
  ) : (
    <InsertDriveFileOutlinedIcon style={{ fontSize: 40 }} />
  );

  return (
    <div className="SingleFile" onDoubleClick={handleDoubleClick}>
      {icon}
      <span className="SingleFile-text">{props.item.key}</span>
    </div>
  );
}

export default SingleFile;
