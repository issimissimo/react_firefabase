import './style.css';


import ReactTest from './reactTest';

import React from 'react';
import ReactDOM from 'react-dom';


// import Panorama from './loaders/PanoramaLoader';
// import Image from './loaders/ImageLoader';
// import Video from './VideoLoader';

// import Socket from './socket';



import {App} from './firebase/firebase';

ReactDOM.render(
    <App />,
    document.getElementById("ReactRoot"));



// ReactDOM.render(
//     <ReactTest author="Daniele Suppo" />,
//     document.getElementById("ReactRoot"));


// Panorama.load();

// setTimeout(() => {
//     Image.load();
// }, 1000)

// Video.load();
