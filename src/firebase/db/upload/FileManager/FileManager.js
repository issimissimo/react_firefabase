import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import SingleFile from "./components/SingleFile";
import "./FileManager.css";

/// Convert an object with files and folders
/// to array
function objToArray(object) {
  const array = [];
  /// iterate for each property of the object
  for (const [key, value] of Object.entries(object)) {
    var newObj = {
      key: value.hasOwnProperty("name") ? value.name : key,
      isFolder: value.hasOwnProperty("name") ? false : true,
      value: value,
    };
    array.push(newObj);
  }
  return array;
}

// function snapshotToArray(snapshot) {
//   var returnArr = [];
//   snapshot.forEach((childSnapshot) => {
//     var item = childSnapshot.val();
//     // console.log(item);

//     /// create children from subObjects (folder)
//     for (var property in item) {
//       if (typeof item[property] == "object") {
//         if (!item.hasOwnProperty("children")) item.children = [];
//         // console.log(property)
//         // console.log(item[property])
//         item.children.push(item[property]);
//       }
//     }

//     item.isFolder = item.hasOwnProperty("name") ? false : true;

//     item.key = item.hasOwnProperty("name") ? item.name : childSnapshot.key;

//     item.icon = item.hasOwnProperty("name") ? (
//       <InsertDriveFileIcon />
//     ) : (
//       <FolderIcon style={{ fontSize: 60 }} />
//     );

//     returnArr.push(item);
//   });
//   return returnArr;
// }

const testObject = {
  primofile: {
    name: "file1.jpg",
    type: "immagine",
    url: "www.ziopippo.com",
    thumUrl: "kjdkjg.com",
  },
  secondofile: {
    name: "file2.jpg",
    type: "immagine",
    url: "www.ziopippo.com",
    thumUrl: "kjdksfsfjg.com",
  },
  sottocartella1: {
    fileDiSottoCartella: {
      name: "fileDiSottoCartella.pdf",
      type: "PDF",
      url: "www.aassdsfsfdsgfsg.com",
    },

    sottocartella2: {
      fileDiSottoCartella2: {
        name: "ultimoFile.xml",
        type: "XML",
        url: "www.afdsgfdrtgtret4353.com",
      },
    },
  },
  terzoFile: {
    name: "file3.jpg",
    type: "immagine",
    url: "www.ziopippo.com",
    thumUrl: "kjdksfsfjg.com",
  },
};

function FileManager(props) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(objToArray(testObject));

    // props.dbRef.on("value", (snapshot) => {
    //   setFiles(objToArray(snapshot.val()));
    // });
  }, []);

  const handleDoubleClickOnItem = (item) => {
    // console.log(item.isFolder);
    // console.log(item.value);
    if (item.isFolder) {
      setFiles(objToArray(item.value));
    }
    else{
      console.log("devo aprire il file...")
    }
  };

  return (
    <div className="FileManager">
      {files.map((item) => (
        <SingleFile key={item.key} item={item} onDoubleClick={handleDoubleClickOnItem} />
      ))}
    </div>
  );
}

export default FileManager;
