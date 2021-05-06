import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "./TopBar.css";


///
/// MENU
///
const Menu = (props) => {
  return (
    <div className="Menu">
      <p>{props.displayName}</p>
      <button
        onClick={() => {
          firebase.auth().signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

///
/// TOP BAR
///
const TopBar = (props) => {
  return (
    <div className="TopBar">
      <p>{props.roomId}</p>
      <Menu displayName={props.displayName}/>
    </div>
  );
};

export default TopBar;
