import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import SingleFile from "./components/SingleFile";
import ToolBar from "./components/ToolBar";
import NavBar from "./components/NavBar";
import "./FileManager.css";
import { Button } from "@material-ui/core";

function FileManager(props) {
  const [foldersOpen, setFoldersOpen] = useState([]);

  const [selected, setSelected] = useState([]);
  const fullPath = useRef();
  const clickedRef = useRef();

  /// NEW....
  const [path, setPath] = useState(["root"]);
  const [files, setFiles] = useState([]);
  const [clicked, setClicked] = useState({});
  const rootObj = useRef();
  const pathRef = useRef(path);

  useEffect(() => {
    clickedRef.current = clicked;
  }, [clicked]);

  ///
  /// on mounting
  ///
  useEffect(() => {
    console.log("---init----")
    /// create rootObj
    rootObj.current = {
      key: "root",
      isFolder: true,
    };
    /// listen to Database changes
    props.dbRef.on("value", (snapshot) => {
      rootObj.current.value = objToArray(snapshot.val());
      console.log(pathRef.current)
      updatePath([...pathRef.current]);
    });
  }, []);

  ///
  /// update files when path change
  ///
  useEffect(() => {
    console.log(path)
    if (rootObj.current) {
      console.log(path)
      const obj = getFolderFromPath(path, rootObj.current);
      setFiles(obj.value);
    }
  }, [path]);


  ///
  /// keep in sync path & pathRef
  ///
  const updatePath = (newPath) => {
    pathRef.current = newPath;
    setPath(newPath);
  }


  ///
  /// move to a next folder by key
  ///
  const moveToNextFolder = (key) => {
    updatePath([...path, key]);
  };

  ///
  /// move to a previous folder by index
  ///
  const moveToPreviousFolder = (index) => {
    const newPath = path.slice(0, index + 1);
    updatePath(newPath);
  };

  // ///
  // /// handle click on item
  // ///
  // const handleClickOnItem = (item) => {
  //   if (item !== selected) {
  //     /// select item
  //     setSelected(item);
  //   } else {
  //     /// remove all selections
  //     setSelected([]);
  //   }
  // };

  ///
  /// handle double click on item
  ///
  const handleDbClickOnItem = (item) => {
    /// move to folder
    if (item.isFolder) {
      moveToNextFolder(item.key);
    } else {
      if (item !== clicked) {
        /// open item
        setClicked(item);
        console.log("devo aprire il file: " + item.key);
      }
    }
  };

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

  /// return all files inside a folder object (also nested)
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

  /// return the folder object
  /// from array of folder names and initial object
  const getFolderFromPath = (path, object) => {
    let folderObj = {};
    let index = 0;
    const iterate = (obj) => {
      if (index < path.length - 1) {
        index++;
        const _obj = obj.value.find((el) => el.name === path[index]);
        iterate(_obj);
      } else folderObj = obj;
    };
    iterate(object);
    return folderObj;
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

  // ///
  // /// open item on doubleclick (file or folder)
  // ///
  // const handleDoubleClickOnItem = (item) => {
  //   // clickedFile.current = item;

  //   if (item.isFolder) {
  //     openFolder(item);
  //   } else {
  //     if (item !== clicked) {
  //       console.log("devo aprire il file: " + item.key);
  //       if (clicked) {
  //         clicked.isClicked = false;
  //       }
  //       item.isClicked = true;
  //       setClicked(item);
  //     }
  //   }
  // };

  // ///
  // /// open folder
  // ///
  // const openFolder = (folder, index = null) => {
  //   setFiles(folder.value);

  //   /// set foldersOpen
  //   const newFoldersOpen =
  //     index === null
  //       ? [...foldersOpen, folder]
  //       : foldersOpen.slice(0, index + 1);
  //   setFoldersOpen(newFoldersOpen);
  //   console.log("--------------");
  //   console.log(newFoldersOpen);
  //   console.log("--------------");

  //   /// set fullPath
  //   fullPath.current = newFoldersOpen.map((folder) => {
  //     return folder.key;
  //   });
  // };

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

  if (files) {
    return (
      <div>
        <ToolBar
          selected={selected}
          onDelete={deleteSelected}
          onCreateFolder={createFolder}
        />
        <NavBar path={path} onClick={moveToPreviousFolder} />
        <div className="FileManager">
          {files.map((item) => (
            <SingleFile
              key={item.name}
              item={item}
              onClick={handleClickOnItem}
              onDoubleClick={handleDbClickOnItem}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return <p>LOADING...</p>;
  }
}

export default FileManager;
