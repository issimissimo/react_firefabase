import React, { useEffect } from "react";
import "./NavBar.css";
import Box from "@material-ui/core/Box";

function NavBar(props) {
  // const handleClick = (folder) => {
  //   console.log("click");
  //   props.onNavigateToFolder(folder);
  // };

  return (
    <div className="NavBar">
      {props.folders.map((folder, index) => (
        <Box
          className="NavBar-item"
          key={index}
          fontWeight="fontWeightMedium"
          onClick={() => props.onNavigateToFolder(folder, index)}
        >
          <span>
            {folder.key + (index === props.folders.length - 1 ? "" : "  >")}
          </span>
        </Box>
      ))}
    </div>
  );
}

export default NavBar;
