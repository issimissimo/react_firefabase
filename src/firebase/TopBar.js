import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "./TopBar.css";


///
/// MENU
///
const Menu = ({user, onSignOut}) => {
  return (
    <div className="Menu">
      <p>{user.displayName}</p>
      <button
        onClick={() => {
          firebase.auth().signOut();
          onSignOut();
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
const TopBar = ({user, roomId, onSignOut}) => {
  return (
    <div className="TopBar">
      <p>{roomId}</p>
      <Menu user={user} onSignOut={onSignOut}/>
    </div>
  );
};

export default TopBar;
