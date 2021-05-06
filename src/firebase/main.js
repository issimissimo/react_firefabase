import React, { useState, useEffect } from "react";
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
const Main = ({ user }) => {
  const [roomId, setRoomId] = useState("cippa");
  const [users, setUsers] = useState([]);

  return (
    <div>
      <TopBar displayName={user.displayName} roomId={roomId} />
      <UserList
        actualUser={user}
        onUsersUpdated={(newUsers) => {
          console.log("uhuwghrhghjdfhjb")
          setUsers(newUsers);
        }}
      />
    </div>
  );
};

export default Main;
