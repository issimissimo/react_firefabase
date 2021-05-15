import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import Button from "@material-ui/core/Button";
import FileUploadContainer from "./FileUploadContainer";

function InputFilesButton(props) {
  const inputRef = useRef(null);

  const handleFileInput = (e) => {
    props.handlePickedFiles(Array.from(e.target.files));
  };

  const handleClick = (e) => {
    inputRef.current.click();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Pick files
      </Button>
      <input
        type="file"
        multiple
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleFileInput}
      />
    </div>
  );
}

//////////////////////////
///////////////////////////
///////////////////////////

function UploaderPanel(props) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const storageRef = useRef();
  const dbRef = useRef();

  useEffect(() => {
    /// set firebase storage and database reference
    storageRef.current = firebase.storage().ref(props.userUid + "/assets/");
    dbRef.current = firebase.database().ref(props.userUid + "/assets/");
  }, []);

  const handlePickedFiles = (inputFiles) => {
    setFiles(inputFiles);
  };

  const uploadAllFiles = () => {
    setUploading(true);
  };

  return (
    <div className="UploaderPanel">
      <div style={{ display: "flex" }}>
        <InputFilesButton handlePickedFiles={handlePickedFiles} />
        {files.length > 0 && (
          <Button variant="contained" color="primary" onClick={uploadAllFiles}>
            UPLOAD ALL
          </Button>
        )}
      </div>

      <div>
        {files.map((file) => (
          <FileUploadContainer
            key={file.name}
            file={file}
            uploading={uploading}
            storageRef={storageRef.current}
            dbRef={dbRef.current}
          />
        ))}
      </div>
    </div>
  );
}

export default UploaderPanel;
