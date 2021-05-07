import React, { useEffect, useState } from "react";
import "./OTOverlay.css";


const NoAudio = () =>{
    return(
        <p>No audio</p>
    )
}


const OTOverlay = ({ name }) => {
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(false);
  return (
    <div className="OTOverlay">
      {!audio && <NoAudio />}
      <div className="OTOverlay-Buttons">
        <button></button>
      </div>
      <div className="OTOverlay-Name">
        <p>{name}</p>
      </div>
    </div>
  );
};

export default OTOverlay;
