import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import SingleFile from "./components/SingleFile";
import ToolBar from "./components/ToolBar";
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
  const clickedRef = useRef();

  useEffect(() => {
    clickedRef.current = clicked;
  }, [clicked]);

  /// on mounting
  useEffect(() => {
    props.dbRef.on("value", (snapshot) => {
      const rootObj = {
        key: "root",
        isFolder: true,
        value: objToArray(snapshot.val()),
      };

      openFolder(rootObj, null, null, clicked);
    });

    // const rootObj = {
    //   key: "Storage",
    //   isFolder: true,
    //   value: objToArray(testObject),
    // };
    // openFolder(rootObj);
  }, []);

  ////////////////////////////////////////////////////////////////////////
  //////////////////// TO BE CONVERTED TO API .../////////////////////////
  ////////////////////////////////////////////////////////////////////////

  /// Convert an object with files and folders
  /// to array
  const objToArray = (object, path = "", folderName = "") => {
    const array = [];
    for (const [key, value] of Object.entries(object)) {
      const slash = folderName ? "/" : "";
      const name = value.hasOwnProperty("name") ? value.name : key;
      const newObj = {
        key: key,
        name: name,
        path: path + folderName + slash,
        visible: name === "index_tmp" ? false : true,
        isFolder: value.hasOwnProperty("name") ? false : true,
        isSelected: false,
        isClicked: name === clickedRef.current.name ? true : false,
        value: value,
      };

      if (newObj.isFolder) {
        newObj.value = objToArray(value, newObj.path, key);
      }

      array.push(newObj);
    }
    return array;
  };

  /// select all files inside a folder (also nested)
  const getAllFilesInFolder = (folder) => {
    const array = [];
    const iterate = (_array) => {
      _array.forEach((el) => {
        if (el.isFolder) iterate(el.value);
        else array.push(el);
      });
    };
    iterate(folder);
    return array;
  };

  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////

  ///
  /// select items on click
  ///
  const handleClickOnItem = (item) => {
    item.isSelected = !item.isSelected;

    /// if is it a folder select all files inside
    if (item.isFolder) {
      const filesInFolder = getAllFilesInFolder(item.value);

      if (item.isSelected) {
        setSelected([...selected, ...filesInFolder]);
        filesInFolder.forEach((el) => (el.isSelected = true));
      } else {
        setSelected(selected.filter((_item) => !filesInFolder.includes(_item)));
        filesInFolder.forEach((el) => (el.isSelected = false));
      }
    }
    /// just a single file
    else {
      item.isSelected
        ? setSelected([...selected, item])
        : setSelected(selected.filter((_item) => _item !== item));
    }
  };

  ///
  /// open item on doubleclick (file or folder)
  ///
  const handleDoubleClickOnItem = (item) => {
    // clickedFile.current = item;

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

  ///
  /// open folder
  ///
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
  };

  ///
  /// delete selected files
  ///
  const deleteSelected = () => {
    selected.forEach((item) => {
      props.dbRef.child(item.path + item.key).remove();
      if (item.name !== "index_tmp")
        props.storageRef.child(item.path + item.name).delete();
    });
    setSelected([]);
  };

  ///
  /// create folder
  ///
  const createFolder = (_folderName) => {
    const folderName = "folder test";
    let path = "";
    for (let i = 1; i < fullPath.current.length; i++)
      path += fullPath.current[i] + "/";
    path += folderName + "/";
    const fileRef = props.dbRef.child(path + "index_tmp");
    fileRef.set({
      name: "index_tmp",
    });
  };

  return (
    <div>
      <ToolBar
        selected={selected}
        onDelete={deleteSelected}
        onCreateFolder={createFolder}
      />
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
