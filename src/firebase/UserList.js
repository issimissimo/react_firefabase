import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";
import { Gathering } from "./gathering";
import "./UserList.css";

///
/// ITEM
///
const UserItem = ({ user, toggleActiveUser }) => {
  // useEffect(() => {
  //   console.log(user);
  // });

  return (
    <tr
      className="UserItem"
      onClick={() => {
        console.log(user.uid);
        toggleActiveUser(user.uid);
      }}
    >
      <td>{user.name}</td>
      <td>{user.isAdmin.toString()}</td>
      <td>{user.isActive.toString()}</td>
    </tr>
  );
};

///
/// LIST
///
const UserList = ({ users, toggleActiveUser }) => {
  return (
    <div className="UserList">
      <h2>USERS IN THE ROOM</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>admin</th>
            <th>active</th>
          </tr>
          {users.map((user) => (
            <UserItem
              key={user.uid}
              user={user}
              toggleActiveUser={toggleActiveUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
