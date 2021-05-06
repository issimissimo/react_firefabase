import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Gathering } from "./gathering";

const UsersList = ({ actualUser }) => {
  const [users, setUsers] = useState([]);
  let isAdmin = true;
  const db = firebase.database();

  const createGathering = () => {
    const gathering = new Gathering(db, "MyRoom", isAdmin, (succes) => {
      if (succes) {
        console.log("create gathering");
        gathering.join(actualUser.uid, actualUser.displayName);

        /// update users
        gathering.onUpdated((newUsers) => {
          // const newArrayOfUsers = [...newUsers]
          setUsers(newUsers);
        });
      } else {
        console.log("ERROR!!...");
      }
    });
  };

  return (
    <div>
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
      <div>
        {users.map((user) => (
          <p key={user.id}>{user.name}</p>
        ))}
      </div>
    </div>
  );
};

export default UsersList;