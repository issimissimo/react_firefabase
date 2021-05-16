import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import FolderIcon from "@material-ui/icons/Folder";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import SingleFile from "./components/SingleFile";
import "./FileManager.css";

function snapshotToArray(snapshot) {
  var returnArr = [];
  snapshot.forEach((childSnapshot) => {
    var item = childSnapshot.val();
    // console.log(item);

    /// create children from subObjects
    for (var property in item) {
      if (typeof item[property] == "object") {

        if (!item.hasOwnProperty("children")){
          item.children = [];
        }
        item.children.push(property);
      }
    }

    item.isFolder = item.hasOwnProperty("name") ? false : true;

    item.key = item.hasOwnProperty("name") ? item.name : childSnapshot.key;
    
    item.icon = item.hasOwnProperty("name") ? (
      <InsertDriveFileIcon />
    ) : (
      <FolderIcon style={{ fontSize: 60 }} />
    );

    returnArr.push(item);
  });
  return returnArr;
}

function FileManager(props) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    props.dbRef.on("value", (snapshot) => {
      // console.log(snapshot.val())
      // console.log(snapshotToArray(snapshot));
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
    <div className="FileManager">
      {files.map((item) => (
        <SingleFile key={item.key} item={item} />
      ))}
    </div>
  );
}

export default FileManager;
