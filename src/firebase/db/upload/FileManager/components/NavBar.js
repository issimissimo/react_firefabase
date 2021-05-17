import React, { useEffect } from "react";
import "./NavBar.css";

function NavBar(props) {
  // const handleClick = (folder) => {
  //   console.log("click");
  //   props.onNavigateToFolder(folder);
  // };

  return (
    <div className="NavBar">
      {props.folders.map((folder, index) => (
        <p key={index} onClick={() => props.onNavigateToFolder(folder, index)}>
          {folder.key + (index === props.folders.length - 1 ? "" : ">")}
        </p>
      ))}
    </div>
  );
}

export default NavBar;
