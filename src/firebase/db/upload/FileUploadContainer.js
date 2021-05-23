import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import ProgressBar from "./ProgressBar";
import "./FileUploadContainer.css";
import {generateID} from "../../generateID"

const removeExtension = (string) => {
  const st = string.replace(/\.[^/.]+$/, "");
  return st;
};

function FileUploadContainer(props) {
  const [path, setPath] = useState("");
  const [uploading, setUploading] = useState(props.uploading);
  const [progressValue, setProgressValue] = useState(0);
  const task = useRef();


  const handleChangePath = (event) => {
    setPath(event.target.value)
  }

  ///
  /// upload the file
  ///
  const uploadFile = () => {
    console.log("uploading " + props.file.name + " ...");
    const storageKey = generateID();
    // const fileRef = props.storageRef.child(path + props.file.name);
    const fileRef = props.storageRef.child(storageKey);
    task.current = fileRef.put(props.file);

    task.current.on(
      "state_changed",

      function progress(snapshot) {
        let percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressValue(Math.floor(percentage));
      },

      function error(err) {
        console.log(err);
      },

      function complete() {
        /// ...and save a reference in database!
        const shortName = removeExtension(props.file.name);
        task.current.snapshot.ref.getDownloadURL().then((fileUrl) => {
          props.dbRef.child(path + shortName).set({
            // type: self.fileType,
            // fullName: self.file.name,
            name: props.file.name,
            storageKey: storageKey,
            url: fileUrl,
            // thumbUrl: null,
            // shared: false,
          });
          console.log("file added successfully");
          props.onFileUploaded();
        });
      }
    );
  };

  useEffect(() => {
    if (props.uploading !== uploading) setUploading(props.uploading);
  }, [props.uploading]);

  useEffect(() => {
    if (uploading) uploadFile();
  }, [uploading]);

  return (
    <div className="FileUploadContainer">
      <p>{props.file.name}</p>
      <input
        type="text"
        value={path}
        onChange={handleChangePath}
      ></input>
      <ProgressBar progress={progressValue} fillColor="blue" />
    </div>
  );
}

export default FileUploadContainer;
