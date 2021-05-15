import "./style.css";

import React from "react";
import ReactDOM from "react-dom";

// import Panorama from './loaders/PanoramaLoader';
// import Image from './loaders/ImageLoader';
// import Video from './VideoLoader';

// import Socket from './socket';

import App from "./firebase/firebase";

import OpenTok from "./openTok/OpenTok";
import IPcam from "./loaders/IPcam/IPcam";


import DbManager from "./firebase/db/DbManager"

/////////////////////////////////////////////////////////////////
///////// SOLO DI TEST PER BYPASSARE L'AUTH INIZIALE ////////////
/////////////////////////////////////////////////////////////////

import firebase from "firebase/app";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyCndxVzDZciBgcRpRXUdilFktBO7YkueYg",
  authDomain: "marketplaceweb-68bd8.firebaseapp.com",
  projectId: "marketplaceweb-68bd8",
  storageBucket: "marketplaceweb-68bd8.appspot.com",
  messagingSenderId: "519512003054",
  appId: "1:519512003054:web:e784c30b66f765cbbb7eff",
  measurementId: "G-8S6HEWR0YJ",
  databaseURL:
    "https://marketplaceweb-68bd8-default-rtdb.europe-west1.firebasedatabase.app",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const email = "a@a.com";
const password = "123456"
const userUid = "PHG8MkCjc9eL0NFhaavu8GNp5Yl2"

firebase
  .auth()
  .signInWithEmailAndPassword(email, password)
  .then((result) => {
    ReactDOM.render(
      // <App roomIdToJoin={roomIdToJoin}/>,

      <div>
        {/* <OpenTok name="Daniele Suppo" adminUid="eGy5XoYOFHfUtA2rLVWzQSPSjGe2" />
        <IPcam /> */}
        <DbManager userUid={userUid}/>
      </div>,

      document.getElementById("ReactRoot")
    );
  });

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

// let roomIdToJoin = null;
// roomIdToJoin = "-M_53BX7Ob5wtzk3CN5J";

// ReactDOM.render(
//   // <App roomIdToJoin={roomIdToJoin}/>,
//   <UploaderPanel/>,
//   document.getElementById("ReactRoot")
// );
