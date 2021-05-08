import React from "react";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import "./OTOverlay.css";

///
/// audio off
///
const AudioOff = () => {
  return (
    <div className="AudioOff">
      <MicOffIcon htmlColor="#00ff40" />
    </div>
  );
};

///
/// toggle button
///
const ToggleBttn = ({ icons, enabled, onClicked }) => {
  const icon = enabled ? icons[0] : icons[1];
  return (
    <div className="ToggleBttn" onClick={onClicked}>
      {icon}
    </div>
  );
};

///
/// OVERLAY
///
const OTOverlay = (props) => {
  const audioIcons = [
    <MicIcon htmlColor="#FFFFFF" />,
    <MicOffIcon htmlColor="#A8A8A8" />,
  ];
  const videoIcons = [
    <VideocamIcon htmlColor="#FFFFFF" />,
    <VideocamOffIcon htmlColor="#A8A8A8" />,
  ];

  const audioToggleBttn = (
    <ToggleBttn
      icons={audioIcons}
      enabled={props.audio}
      onClicked={props.toggleAudio}
    />
  );
  const videoToggleBttn = (
    <ToggleBttn
      icons={videoIcons}
      enabled={props.video}
      onClicked={props.toggleVideo}
    />
  );
  return (
    <div className="OTOverlay">
      {!props.audio && <AudioOff />}
      <div className="OTOverlay-Buttons">
        {audioToggleBttn}
        {videoToggleBttn}
      </div>
      <div className="OTOverlay-Name">
        <p>{props.name}</p>
      </div>
    </div>
  );
};

export default OTOverlay;
