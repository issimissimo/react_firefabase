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
const Main = ({ myUser, roomIdToJoin = null }) => {
  const [roomId, setRoomId] = useState(null);
  const [users, setUsers] = useState([]);
  const db = firebase.database();
  const isAdmin = useRef();
  const gathering = useRef();
  const activeUserUid = useRef();

  useEffect(() => {
    myUser.getIdTokenResult().then((idTokenResult) => {
      isAdmin.current = idTokenResult.claims.admin ? true : false;
      joinOrCreateGathering();
    });
  }, []);

  /// create gathering
  const joinOrCreateGathering = () => {
    console.log(isAdmin.current);

    const _roomId =
      isAdmin.current && !roomIdToJoin ? generateID() : roomIdToJoin;
    gathering.current = new Gathering(
      db,
      _roomId,
      isAdmin.current,
      (succes) => {
        if (succes) {
          gathering.current.join(myUser.uid, myUser.displayName);
          setRoomId(_roomId);

          /// store the roomId in local storage
          if (isAdmin.current) {
            window.localStorage.setItem("roomId", _roomId);
          }

          /// listen for users updated
          gathering.current.onUpdated((newUsers) => {
            newUsers.forEach((user) => {
              if (user.isActive) activeUserUid.current = user.uid;
            });
            setUsers(newUsers);
          });
        } else {
          console.log("ERROR!!....");
        }
      }
    );
  };

  const toggleActiveUser = (uid) => {
    if (uid !== activeUserUid.current) {
      gathering.current.room.child(activeUserUid.current).update({
        isActive: false,
      });
      gathering.current.room.child(uid).update({
        isActive: true,
      });
    }
  };

  /// onSignOut
  const removeGathering = () => {
    if (isAdmin.current) {
      gathering.current.over();
    }

    // /// clear the storage
    // window.localStorage.clear();
  };

  return (
    <div>
      <TopBar user={myUser} roomId={roomId} onSignOut={removeGathering} />
      <UserList users={users} toggleActiveUser={toggleActiveUser} />
      <button onClick={joinOrCreateGathering}>CREATE</button>
      {/* <button onClick={joinRoom}>JOIN</button> */}
    </div>
  );
};

export default Main;
