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
import UserList from './UserList'

function TopBar(props) {
  return (
    <div className="top-bar">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>{props.roomID}</p>
        <p>{props.displayName}</p>
        <button
          onClick={() => {
            firebase.auth().signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}



// const UsersList = ({ actualUser }) => {
//   const [users, setUsers] = useState([]);
//   let isAdmin = true;
//   const db = firebase.database();

//   const createGathering = () => {
//     const gathering = new Gathering(db, "MyRoom", isAdmin, (succes) => {
//       if (succes) {
//         console.log("create gathering");
//         gathering.join(actualUser.uid, actualUser.displayName);

//         /// update users
//         gathering.onUpdated((newUsers) => {
//           // const newArrayOfUsers = [...newUsers]
//           setUsers(newUsers);
//         });
//       } else {
//         console.log("ERROR!!...");
//       }
//     });
//   };

//   return (
//     <div>
//       <button onClick={createGathering}>CREATE</button>
//       <button
//         onClick={() => {
//           isAdmin = false;
//           createGathering();
//         }}
//       >
//         JOIN
//       </button>
//       <h2>USERS IN THE ROOM</h2>
//       <div>
//         {users.map((user) => (
//           <p key={user.id}>{user.name}</p>
//         ))}
//       </div>
//     </div>
//   );
// };

////////////////////
/// MAIN WINDOW
////////////////////
function Main({ user }) {

  return (
    <div>
      <TopBar displayName={user.displayName} />
      <UserList actualUser={user} />
    </div>
  );
}



export default Main;
