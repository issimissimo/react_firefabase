import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

function snapshotToArray(snapshot) {
  var returnArr = [];
  snapshot.forEach(function (childSnapshot) {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;
}

function FileListPanel(props) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    props.dbRef.on("value", (snapshot) => {
      console.log(snapshotToArray(snapshot));
      setFiles(snapshotToArray(snapshot));

      // console.log(snapshot.val());

      // const obj = snapshot.val();

      // obj.forEach((item) => {
      //   console.log(item);
      // });

      // var result = Object.keys(obj).map((key) => [key, obj[key]]);

      // var result = Object.entries(obj);
      // console.log(result)
    });
  }, []);

  return (
    <div>
      <h1>LISTA DEI FILES</h1>
      {files.map(file => (
        <p key={file.name}>{file.name}</p>
      ))}
    </div>
  );
}

export default FileListPanel;
