import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import FileManager from "./upload/FileManager/FileManager";
import UploaderPanel from "./upload/UploaderPanel";

function DbManager(props) {
  const storageRef = firebase.storage().ref(props.userUid + "/assets/");
  const dbRef = firebase.database().ref(props.userUid + "/assets/");

  return (
    <div>
      <UploaderPanel storageRef={storageRef} dbRef={dbRef} />
      <FileManager storageRef={storageRef} dbRef={dbRef} />
    </div>
  );
}

export default DbManager;
