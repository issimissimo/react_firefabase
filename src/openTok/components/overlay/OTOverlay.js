import React, { useEffect, useState } from "react";
import "./OTOverlay.css";

const OTOverlay = ({ name }) => {
  const [isOver, setIsOver] = useState(false);
  return (
    <div className="OTOverlay">
      <div
        className="OTOverlay-Buttons"
        onMouseOver={() => {
          console.log("over");
        }}
        onMouseLeave={() => {
          console.log("exit");
        }}
      ></div>
      <div className="OTOverlay-Name">
        <p>{name}</p>
      </div>
    </div>
  );
};

export default OTOverlay;
