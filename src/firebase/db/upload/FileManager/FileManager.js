import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import SingleFile from "./components/SingleFile";
import NavBar from "./components/NavBar";
import "./FileManager.css";
import { Button } from "@material-ui/core";

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
  const [clicked, setClicked] = useState({});
  const [selected, setSelected] = useState([]);
  const fullPath = useRef();

  /// on mounting
  useEffect(() => {
    props.dbRef.on("value", (snapshot) => {
      const rootObj = {
        key: "root",
        isFolder: true,
        value: objToArray(snapshot.val()),
      };
      openFolder(rootObj);
    });

    // const rootObj = {
    //   key: "Storage",
    //   isFolder: true,
    //   value: objToArray(testObject),
    // };
    // openFolder(rootObj);

  }, []);

  /// Convert an object with files and folders
  /// to array
  const objToArray = (object, path = "", folderName = "") => {
    const array = [];
    for (const [key, value] of Object.entries(object)) {
      const slash = folderName ? "/" : "";
      const newObj = {
        key: key,
        name: value.hasOwnProperty("name") ? value.name : key,
        path: path + folderName + slash,
        isFolder: value.hasOwnProperty("name") ? false : true,
        // isSelected: key === selected.key ? true : false,
        isClicked: key === clicked.key ? true : false,
        value: value,
      };

      if (newObj.isFolder) {
        newObj.value = objToArray(value, newObj.path, key);
      }

      array.push(newObj);
    }
    return array;
  };

  const handleClickOnItem = (item) => {
    item.isSelected = !item.isSelected;
    item.isSelected
      ? setSelected([...selected, item])
      : setSelected(selected.filter((_item) => _item !== item));
  };

  const handleDoubleClickOnItem = (item) => {
    if (item.isFolder) {
      openFolder(item);
    } else {
      if (item !== clicked) {
        console.log("devo aprire il file: " + item.key);
        if (clicked) {
          clicked.isClicked = false;
        }
        item.isClicked = true;
        setClicked(item);
      }
    }
  };

  const openFolder = (folder, index = null) => {
    setFiles(folder.value);

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

  const deleteSelected = () => {
    selected.forEach((item) => {
      console.log(item.path + item.key);
      console.log(item.path + item.name);
      props.dbRef.child(item.path + item.key).remove();
      props.storageRef.child(item.path + item.name).delete();
    });
    setSelected([]);
  };

  return (
    <div>
      <Button onClick={deleteSelected}>DELETE</Button>
      <NavBar folders={foldersOpen} onNavigateToFolder={openFolder} />
      <div className="FileManager">
        {files.map((item) => (
          <SingleFile
            key={item.name}
            item={item}
            onClick={handleClickOnItem}
            onDoubleClick={handleDoubleClickOnItem}
          />
        ))}
      </div>
    </div>
  );
}

export default FileManager;
