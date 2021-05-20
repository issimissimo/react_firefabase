import React from "react";
import "./NavBar.css";
import Box from "@material-ui/core/Box";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

// function NavBar(props) {
//   return (
//     <div className="NavBar">
//       {props.folders.map((folder, index) => (
//         <Box
//           className="NavBar-item"
//           key={index}
//           fontWeight="fontWeightMedium"
//           onClick={() => props.onNavigateToFolder(folder, index)}
//         >
//           <span>
//             {folder.key + (index === props.folders.length - 1 ? "" : "  >")}
//           </span>
//         </Box>
//       ))}
//     </div>
//   );
// }

function NavBar(props) {
  return (
    <div className="NavBar">
      {props.path.map((key, index) => (
        <div key={index} className="NavBar-div">
          <Box
            className="NavBar-item"
            fontWeight="fontWeightMedium"
            onClick={() => props.onClick(index)}
          >
            {key}
          </Box>
          {/* arrow */}
          {index < props.path.length - 1 && (
            <ArrowForwardIosIcon style={{ fontSize: 10 }} />
          )}
        </div>
      ))}
    </div>
  );
}

export default NavBar;
