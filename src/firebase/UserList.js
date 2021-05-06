import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Gathering } from "./gathering";
import "./UserList.css";

///
/// ITEM
///
const UserItem = ({ user }) => {
  // useEffect(() => {
  //   console.log(user);
  // });

  return (
    <tr className="UserItem">
      <td>{user.name}</td>
      <td>{user.isAdmin.toString()}</td>
      <td>{user.isActive.toString()}</td>
    </tr>
  );
};

///
/// LIST
///
const UserList = ({ actualUser, onUsersUpdated, onGathering }) => {
  const [users, setUsers] = useState([]);
  let isAdmin = true;
  const db = firebase.database();
  const gatheringID = "MyRoom";

  const createGathering = () => {
    const gathering = new Gathering(db, gatheringID, isAdmin, (succes) => {
      if (succes) {
        gathering.join(actualUser.uid, actualUser.displayName);

        /// set the gatheringID in parent component
        onGathering(gatheringID);

        /// listen for users updated
        gathering.onUpdated((newUsers) => {
          setUsers(newUsers);

          /// questo è da fare...
          onUsersUpdated(newUsers);
        });
      } else {
        console.log("ERROR!!...");
      }
    });
  };

  return (
    <div className="UserList">
      <button onClick={createGathering}>CREATE</button>
      <button
        onClick={() => {
          isAdmin = false;
          createGathering();
        }}
      >
        JOIN
      </button>
      <h2>USERS IN THE ROOM</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>admin</th>
            <th>active</th>
          </tr>
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
