import './style.css';

import Test from './test';
import ReactTest from './reactTest';

import React from 'react';
import ReactDOM from 'react-dom';


import Panorama from './loaders/PanoramaLoader';
import Image from './loaders/ImageLoader';
import Video from './VideoLoader';

import Socket from './socket';

// function draw() {
//     const el = document.createElement('div');
//     const btn = document.createElement('button');
//     el.innerHTML = 'Hello Webpack';
//     el.classList.add('hello');

//     btn.innerHTML = "GET PROFILE!!!";
//     btn.onclick = getProfile;
//     el.appendChild(btn);


//     const img = document.createElement('img');
//     img.src = imgTest;
//     img.classList.add('myImage');
//     el.appendChild(img);

//     return el;
// }

// document.body.appendChild(draw());

// Test.print();


ReactDOM.render(
    <ReactTest author="Daniele Suppo" />,
    document.getElementById("ReactRoot"));


Panorama.load();

setTimeout(() => {
    Image.load();
}, 1000)

Video.load();
