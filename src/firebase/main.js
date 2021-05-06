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
  const [gatheringID, setGatheringID] = useState(null);
  const [users, setUsers] = useState([]);

  return (
    <div>
      <TopBar displayName={user.displayName} roomId={gatheringID} />
      <UserList
        actualUser={user}
        users={users}
        onGathering={(gatheringID) => {
          setGatheringID(gatheringID);
        }}
        onUsersUpdated={(newUsers) => {
          console.log("sto portando gli users sù dal parent...");
          setUsers(newUsers);
        }}
      />
    </div>
  );
};

export default Main;
