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
  const [filesInUpload, setFilesinUpload] = useState(0);
  const filesToBeUploaded = useRef();

  const handlePickedFiles = (inputFiles) => {
    setFiles(inputFiles);
    setFilesinUpload(inputFiles.length);
    filesToBeUploaded.current = inputFiles.length;
  };

  const uploadAllFiles = () => {
    setUploading(true);
  };

  const onFileUploaded = () => {
    /// disable uploading as default
    setUploading(false);
    /// set the number of uploading files
    filesToBeUploaded.current -= 1;
    setFilesinUpload(filesToBeUploaded.current);
    console.log("uploading pending files: " + filesToBeUploaded.current);
  };

  return (
    <div className="UploaderPanel">
      {console.log({ filesInUpload })}
      <div style={{ display: "flex" }}>
        <InputFilesButton handlePickedFiles={handlePickedFiles} />
        {filesInUpload > 0 && (
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
            storageRef={props.storageRef}
            dbRef={props.dbRef}
            onFileUploaded={onFileUploaded}
          />
        ))}
      </div>
    </div>
  );
}

export default UploaderPanel;
