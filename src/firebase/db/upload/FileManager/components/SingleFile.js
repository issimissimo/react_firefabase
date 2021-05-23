import React, { useState, useEffect, useRef } from "react";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./SingleFile.css";
import useSingleAndDoubleClicks from "./utils/useSingleAndDoubleClicks";
import { compareToObject } from "./utils/compare";
import { compareToArray } from "./utils/compare";

function SingleFile(props) {
  const [state, setState] = useState(props.state);
  /// handle click on item
  const clickHandler = (e) => {
    props.onClick(props.item, e.ctrlKey);
  };
  /// handle double click on item
  const doubleClickHandler = () => {
    props.onDoubleClick(props.item);
  };

  const { handleClick, handleDoubleClick } = useSingleAndDoubleClicks({
    onClick: clickHandler,
    onDoubleClick: doubleClickHandler,
  });

  const icon = props.item.isFolder ? (
    <FolderOpenOutlinedIcon style={{ fontSize: 70 }} />
  ) : (
    <InsertDriveFileOutlinedIcon style={{ fontSize: 40 }} />
  );

  const fileSelectedIcon = () => {
    if (compareToArray(props.item, props.selected)) {
      return (
        <div className="FileSelected">
          <CheckCircleIcon style={{ fontSize: 20 }} />
        </div>
      );
    } else {
      return null;
    }
  };

  if (props.item.visible) {
    return (
      <div
        className={`${
          compareToObject(props.item, props.clicked) ? "SingleFile-clicked" : ""
        }  SingleFile`}
        onClick={(e) => {
          handleClick(e);
        }}
        onDoubleClick={handleDoubleClick}
      >
        {icon}
        <span className="SingleFile-text">{props.item.name}</span>
        {fileSelectedIcon()}
      </div>
    );
  }
  return null;
}

export default SingleFile;
