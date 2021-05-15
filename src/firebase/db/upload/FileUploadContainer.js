import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import ProgressBar from "./ProgressBar";
import "./FileUploadContainer.css";

const removeExtension = (string) => {
  const st = string.replace(/\.[^/.]+$/, "");
  return st;
};

function FileUploadContainer(props) {
  const [uploading, setUploading] = useState(props.uploading);
  const [progressValue, setProgressValue] = useState(0);
  const task = useRef();

  ///
  /// upload the file
  ///
  const uploadFile = () => {
    console.log("uploading " + props.file.name + " ...");
    const fileRef = props.storageRef.child(props.file.name);
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
          props.dbRef.child(shortName).set({
            // type: self.fileType,
            // fullName: self.file.name,
            name: props.file.name,
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
      <ProgressBar progress={progressValue} fillColor="blue" />
    </div>
  );
}

export default FileUploadContainer;
