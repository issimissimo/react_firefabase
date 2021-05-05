import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
} from "@react-firebase/auth";
import { config } from "./firebaseConfig";
import { Gathering } from "./gathering";

function TopBar(props) {
  return (
    <div className="top-bar">
      <div style={{ display: "flex" }}>
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

////////////////////
/// MAIN WINDOW
////////////////////
function Main({ user }) {
  return <TopBar displayName={user.displayName} />;
}

// function Main(props) {
//   const [count, setCount] = useState(122);
//   const [happy, setHappy] = useState(true);
//   const changeHappy = () => {
//     setHappy(!happy);
//   };
//   return (
//     <>
//       <p>{count}</p>
//       <button
//         onClick={() => {
//           setCount(count + 1);
//         }}
//       ></button>
//       <h1 onClick={changeHappy}>{happy ? ":)" : ":("}</h1>
//     </>
//   );
// }

export default Main;
