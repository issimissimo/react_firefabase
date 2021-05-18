import React, { useState, useEffect, useRef, useCallback } from "react";
import FolderOpenOutlinedIcon from "@material-ui/icons/FolderOpenOutlined";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import "./SingleFile.css";
// import { useClickPreventionOnDoubleClick } from "./utils/stop-triggering-onclick-twice-ondoubleclick";
import useSingleAndDoubleClicks from "./utils/useSingleAndDoubleClicks";

// /////////////////////////////////////////////////////////////////
// const ClickableBox = (props) => {
//   const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(
//     props.onClick,
//     props.onDoubleClick
//   );

//   return (
//     <div
//       className={props.className}
//       onClick={handleClick}
//       onDoubleClick={handleDoubleClick}
//     >
//       {props.children}
//     </div>
//   );
// };

// ///////////////////////////////////////////////////////////////////////////

// function useSingleAndDoubleClicks({ onClick, onDoubleClick }) {
//   const timer = useRef;

//   const cancelPendingClick = useCallback(() => {
//     if (timer.current) {
//       clearTimeout(timer.current);
//       timer.current = null;
//     }
//   }, [timer]);

//   /**
//    * This handler must delay long enough to be sure a second click will not trigger a double-click.
//    * According to Microsoft, in Windows the max delay between clicks for a double-click is 500ms.
//    * Other operating systems can have other delays, and most have customizable settings.
//    */
//   const handleClick = useCallback(
//     (data) => {
//       // We only cache the most recent click event, so cancel any pending clicks
//       cancelPendingClick();
//       timer.current = setTimeout(() => {
//         timer.current = null;
//         onClick(data);
//       }, 300);
//     },
//     [timer, cancelPendingClick, onClick]
//   );

//   const handleDoubleClick = useCallback(
//     (data) => {
//       cancelPendingClick();
//       onDoubleClick(data);
//     },
//     [cancelPendingClick, onDoubleClick]
//   );

//   return { handleClick, handleDoubleClick };
// }

//////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////

// function _SingleFile(props) {
//   const [selected, setSelected] = useState(props.item.isSelected);

//   const { handleClick, handleDoubleClick } = useSingleAndDoubleClicks({
//     onClick: myClickHandler,
//     onDoubleClick: myDoubleClickHandler,
//   });

//   const myClickHandler = () => {
//     console.log("clickkkk....");
//   };
//   const myDoubleClickHandler = () => {
//     console.log("doubleclick....");
//   };

//   //   const handleClick = () => {
//   //     props.item.isSelected = !props.item.isSelected;
//   //     setSelected(props.item.isSelected);
//   //     props.onClick(props.item);
//   //   };

//   //   const handleDoubleClick = () => {
//   //     props.onDoubleClick(props.item);
//   //   };

//   const icon = props.item.isFolder ? (
//     <FolderOpenOutlinedIcon style={{ fontSize: 70 }} />
//   ) : (
//     <InsertDriveFileOutlinedIcon style={{ fontSize: 40 }} />
//   );

//   return (
//     // <div
//     //   className={`${props.item.isClicked ? "SingleFile-clicked" : ""} ${
//     //     selected ? "SingleFile-selected" : ""
//     //   } SingleFile`}
//     //   onClick={handleClick}
//     //   onDoubleClick={handleDoubleClick}
//     // >
//     //   {icon}
//     //   <span className="SingleFile-text">{props.item.name}</span>
//     // </div>
//     <NewClickableBox />
//   );
// }

export default SingleFile;
