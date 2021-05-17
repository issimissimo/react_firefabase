import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import SingleFile from "./components/SingleFile";
import NavBar from "./components/NavBar";
import "./FileManager.css";

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
  const [foldersOpen, setFoldersOpen] = useState([]);
  const fullPath = useRef();

  /// on mounting
  useEffect(() => {
    // props.dbRef.on("value", (snapshot) => {
    //   const rootObj = {
    //     key: "root",
    //     isFolder: true,
    //     value: snapshot.val(),
    //   };
    //   openFolder(rootObj);
    // });

    const rootObj = {
      key: "root",
      isFolder: true,
      value: testObject,
    };
    openFolder(rootObj);
  }, []);

  /// Convert an object with files and folders
  /// to array
  const objToArray = (object) => {
    const array = [];
    for (const [key, value] of Object.entries(object)) {
      var newObj = {
        // key: value.hasOwnProperty("name") ? value.name : key,
        key: key,
        isFolder: value.hasOwnProperty("name") ? false : true,
        value: value,
      };
      array.push(newObj);
    }
    return array;
  };

  const handleDoubleClickOnItem = (item) => {
    if (item.isFolder) {
      openFolder(item);
    } else {
      console.log("devo aprire il file: " + item.key);
    }
  };

  const openFolder = (folder, index = null) => {
    refresh(folder.value);

    /// set foldersOpen
    const newFoldersOpen =
      index === null
        ? [...foldersOpen, folder]
        : foldersOpen.slice(0, index + 1);
    setFoldersOpen(newFoldersOpen);

    /// set fullPath
    fullPath.current = newFoldersOpen.map((folder) => {
      return folder.key;
    });
    console.log(fullPath.current);
  };

  /// refresh files
  const refresh = (inputObj) => {
    setFiles(objToArray(inputObj));
  };

  return (
    <div>
      <NavBar folders={foldersOpen} onNavigateToFolder={openFolder} />
      <div className="FileManager">
        {files.map((item) => (
          <SingleFile
            key={item.key}
            item={item}
            onDoubleClick={handleDoubleClickOnItem}
          />
        ))}
      </div>
    </div>
  );
}

export default FileManager;
