import React, { useState, useEffect, useRef} from "react";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import "./SingleFile.css";
import useSingleAndDoubleClicks from "./utils/useSingleAndDoubleClicks";

function SingleFile(props) {
  const myClickHandler = () => {
    console.log("clickkkk....");
    props.onClick(props.item);
  };
  const myDoubleClickHandler = () => {
    console.log("doubleclick....");
    props.onDoubleClick(props.item);
  };

  const { handleClick, handleDoubleClick } = useSingleAndDoubleClicks({
    onClick: myClickHandler,
    onDoubleClick: myDoubleClickHandler,
  });

  const icon = props.item.isFolder ? (
    <FolderOpenOutlinedIcon style={{ fontSize: 70 }} />
  ) : (
    <InsertDriveFileOutlinedIcon style={{ fontSize: 40 }} />
  );

  return (
    <div
      className={`${props.item.isClicked ? "SingleFile-clicked" : ""} ${
        props.item.isSelected ? "SingleFile-selected" : ""
      } SingleFile`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {icon}
      <span className="SingleFile-text">{props.item.name}</span>
    </div>
  );
}

export default SingleFile;
