import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import SingleFile from "./components/SingleFile";
import ToolBar from "./components/ToolBar";
import NavBar from "./components/NavBar";
import "./FileManager.css";
import { compareToArray } from "./components/utils/compare";

function FileManager(props) {
  const [path, setPath] = useState(["root"]);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [clicked, setClicked] = useState({});
  const rootObj = useRef({});
  const pathRef = useRef(path);

  ///
  /// on mounting
  ///
  useEffect(() => {
    /// create rootObj
    rootObj.current = {
      key: "root",
      isFolder: true,
    };
    /// listen to Database changes
    props.dbRef.on("value", (snapshot) => {
      rootObj.current.value = objToArray(snapshot.val());
      updatePath([...pathRef.current]);
    });
  }, []);

  ///
  /// update files when path change
  ///
  useEffect(() => {
    if (rootObj.current) {
      const obj = getFolderFromPath(path, rootObj.current);
      setFiles(obj.value);
    }
  }, [path]);

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

  ///
  /// handle single click on item
  ///
  const handleClickOnItem = (item, ctrlKey) => {
    const files = [];
    files.push(item);

    if (!compareToArray(item, selected)) {
      /// select item
      ctrlKey ? setSelected([...selected, ...files]) : setSelected(files);
    } else {
      /// remove selections
      ctrlKey
        ? setSelected(selected.filter((_item) => !files.includes(_item)))
        : setSelected([]);
    }
  };

  ///
  /// handle double click on item
  ///
  const handleDoublebClickOnItem = (item) => {
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

  /// update the path (and keep in sync path & pathRef)
  /// this function is "functional" for other methods
  const updatePath = (newPath) => {
    pathRef.current = newPath;
    setPath(newPath);
  };

  ////////////////////////////////////////////////////////////////////////
  //////////////////// TO BE CONVERTED TO API .../////////////////////////
  ////////////////////////////////////////////////////////////////////////

  /// Convert an object with files and folders
  /// to array
  const objToArray = (object, path = "", folderName = "") => {
    const array = [];
    if (object) {
      for (const [key, value] of Object.entries(object)) {
        const slash = folderName ? "/" : "";
        const name = value.hasOwnProperty("name") ? value.name : key;
        const newObj = {
          key: key,
          name: name,
          path: path + folderName + slash,
          visible: name === "index_tmp" ? false : true,
          isFolder: value.hasOwnProperty("name") ? false : true,
          // isSelected: false,
          // isClicked: name === clickedRef.current.name ? true : false,
          value: value,
        };

        if (newObj.isFolder) {
          newObj.value = objToArray(value, newObj.path, key);
        }

        array.push(newObj);
      }
    }
    console.log(array);
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
    iterate(folder.value);
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
  /// delete selected files
  ///
  const deleteSelected = () => {
    const itemsToDelete = [...selected];

    /// get all the files in the folder
    selected.forEach((item) => {
      if (item.isFolder) {
        itemsToDelete.push(...getAllFilesInFolder(item));
      }
    });

    itemsToDelete.forEach((item) => {
      if (!item.isFolder) {
        /// delete from db
        props.dbRef.child(item.path + item.key).remove();
        /// delete from storage
        if (item.name !== "index_tmp")
          props.storageRef.child(item.value.storageKey).delete();
      }
    });
    setSelected([]);
  };

  ///
  /// create folder
  ///
  const createFolder = (folderName) => {
    let _path = "";
    for (let i = 1; i < path.length; i++) _path += path[i] + "/";
    _path += folderName + "/";
    const fileRef = props.dbRef.child(_path + "index_tmp");
    fileRef.set({
      name: "index_tmp",
    });
  };

  ///
  /// upload files
  ///
  const uploadFiles = (files) => {
    console.log(files);
  };

  ///
  /// rename a single selected files
  ///
  const renameSelected = (newName) => {
    const item = selected[0];
    const newKey = newName;
    const fileRef = props.dbRef;
    fileRef
      .child(item.path + item.key)
      .once("value")
      .then((snap) => {
        var data = snap.val();
        console.log(data);
        if (!item.isFolder) data.name = newName;
        var update = {};
        update[item.path + item.key] = null;
        update[item.path + newKey] = data;
        fileRef.update(update);
      });
    setSelected([]);
  };

  ///
  /// render
  ///
  if (files) {
    return (
      <div>
        <ToolBar
          selected={selected}
          onDelete={deleteSelected}
          onRename={renameSelected}
          onCreateFolder={createFolder}
          onUpload={uploadFiles}
        />
        <NavBar path={path} onClick={moveToPreviousFolder} />
        <div className="FileManager">
          {files.map((item) => (
            <SingleFile
              key={item.name}
              item={item}
              selected={selected}
              clicked={clicked}
              onClick={handleClickOnItem}
              onDoubleClick={handleDoublebClickOnItem}
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
