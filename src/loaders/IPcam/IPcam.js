import React, { useState } from "react";
import "./IPcam.css";



const IPcam = () => {
  return (
    // <div className="IPcam">
    //   <iframe
    //     src="https://g0.ipcamlive.com/player/player.php?alias=6087249300468&autoplay=1&disablefullscreen=1&disablevideofit=1"
    //     width="100%"
    //     height="100%"
    //     frameBorder="0"
    //   ></iframe>
    // </div>

    <div
      dangerouslySetInnerHTML={{
        __html: "<iframe src='https://g0.ipcamlive.com/player/player.php?alias=6087249300468&autoplay=1&disablefullscreen=1&disablevideofit=1' width='100%' height='100%' frameBorder='0'/>",
      }}
    ></div>
  );
};

export default IPcam;
