import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
} from "@react-firebase/auth";
import { config } from "./firebaseConfig";
import { Gathering } from "./gathering";
import { generateID } from "./generateID";
import UserList from "./UserList";
import TopBar from "./TopBar";

///
/// MAIN
///
const Main = ({ myUser, receivedRoomId = null }) => {
  const [roomId, setRoomId] = useState(null);
  const [users, setUsers] = useState([]);
  const db = firebase.database();
  let isAdmin = true;
  const gathering = useRef();

  useEffect(() => {}), [];

  /// create gathering
  const createGathering = () => {

    myUser.getIdTokenResult().then(idTokenResult =>{
      console.log("-------------")
          console.log(idTokenResult.claims)
          console.log("-------------")         
    })

    const storedRoomId = window.localStorage.getItem("roomId");
    const newRoomId = receivedRoomId ? receivedRoomId : generateID();
    gathering.current = new Gathering(db, newRoomId, isAdmin, (succes) => {
      if (succes) {
        gathering.current.join(myUser.uid, myUser.displayName);
        setRoomId(newRoomId);

        /// listen for users updated
        gathering.current.onUpdated((newUsers) => {
          setUsers(newUsers);
        });
      } else {
        console.log("ERROR!!...");
      }
    });
  };

  const toggleActiveUser = (uid) => {
    console.log(myUser.uid);
    gathering.current.room.child(uid).update({
      isActive: true,
    });
  };

  /// remove gathering
  const removeGathering = () => {
    if (gathering.current) {
      gathering.current.over();
    }
  };

  return (
    <div>
      <TopBar user={myUser} roomId={roomId} onSignOut={removeGathering} />
      <UserList users={users} />
      <button onClick={createGathering}>CREATE</button>
      <button
        onClick={() => {
          isAdmin = false;
          createGathering();
        }}
      >
        JOIN
      </button>
    </div>
  );
};

export default Main;
