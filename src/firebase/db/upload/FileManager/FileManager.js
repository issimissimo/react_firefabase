import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";
import SingleFile from "./components/SingleFile";
import ToolBar from "./components/ToolBar";
import NavBar from "./components/NavBar";
import "./FileManager.css";
import { compareToObject } from "./components/utils/compare";
import { compareToArray } from "./components/utils/compare";
// import RenamePanel from "./components/Animated-modal.component"

function FileManager(props) {
  const [path, setPath] = useState(["root"]);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [clicked, setClicked] = useState({});
  const [uploading, setUploading] = useState([]);
  const [modalOpen, setModalOpen] = useState(false)
  const rootObj = useRef({});
  const pathRef = useRef(path);
  // const newFolder = useRef({});

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
    const files = item.isFolder ? getAllFilesInFolder(item) : [];
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
    console.log(array)
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

  // ///
  // /// select items on click
  // ///
  // const _handleClickOnItem = (item) => {
  //   item.isSelected = !item.isSelected;

  //   /// if is it a folder select all files inside
  //   if (item.isFolder) {
  //     const filesInFolder = getAllFilesInFolder(item.value);

  //     if (item.isSelected) {
  //       setSelected([...selected, ...filesInFolder]);
  //       filesInFolder.forEach((el) => (el.isSelected = true));
  //     } else {
  //       setSelected(selected.filter((_item) => !filesInFolder.includes(_item)));
  //       filesInFolder.forEach((el) => (el.isSelected = false));
  //     }
  //   }
  //   /// just a single file
  //   else {
  //     item.isSelected
  //       ? setSelected([...selected, item])
  //       : setSelected(selected.filter((_item) => _item !== item));
  //   }
  // };

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
      if (!item.isFolder) {
        props.dbRef.child(item.path + item.key).remove();
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

    console.log(folderName)

    // /// set newFolder current as a fake obj
    // /// to compare it next with the new folder,
    // /// so to check if it's just created and need
    // /// to be renamed
    // newFolder.current = {
    //   name: _folderName,
    //   path: "",
    // }

    

    // const folderName = "New folder";
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
  /// rename
  ///
  const rename = () => {
    /// reset newFolder current
    // newFolder.current = {}

    const key = "folder test";
    const newKey = "cartella";
    const newName = "newCattura.JPG";
    const fileRef = props.dbRef;
    fileRef
      .child(key)
      .once("value")
      .then((snap) => {
        var data = snap.val();
        console.log(data);
        // data.name = newName;
        var update = {};
        update[key] = null;
        update[newKey] = data;
        fileRef.update(update);
      });
  };

  ///
  /// render
  ///
  if (files) {
    return (
      <div>
        {/* <RenamePanel isOpen={modalOpen}/> */}
        <ToolBar
          selected={selected}
          onDelete={deleteSelected}
          onCreateFolder={createFolder}
          onUpload={uploadFiles}
          onRename={rename}
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
