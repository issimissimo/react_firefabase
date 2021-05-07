import "./style.css";

import React from "react";
import ReactDOM from "react-dom";

// import Panorama from './loaders/PanoramaLoader';
// import Image from './loaders/ImageLoader';
// import Video from './VideoLoader';

// import Socket from './socket';

import App from "./firebase/firebase";


let roomIdToJoin = null;
roomIdToJoin = "-M_53BX7Ob5wtzk3CN5J";


ReactDOM.render(
  <App roomIdToJoin={roomIdToJoin}/>,
  document.getElementById("ReactRoot")
);

// ReactDOM.render(
//     <ReactTest author="Daniele Suppo" />,
//     document.getElementById("ReactRoot"));

// Panorama.load();

// setTimeout(() => {
//     Image.load();
// }, 1000)

// Video.load();
