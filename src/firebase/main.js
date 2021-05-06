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

const randomName = () => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
};

const test = (count, users) => {
  console.log(count);
  console.log(users);
};

////////////////////
/// MAIN WINDOW
////////////////////
function Main({ user }) {
  let gathering;

  const createRoom = () =>{
    gathering = new Gathering(firebase.database(), "MyRoom", true, (succes) => {
      console.log("create gathering");
      gathering.join(user.uid, user.displayName);

      gathering.onUpdated((count, users) => {
        test(count, users);
      });
    });
  }

  const joinRoom = () =>{
    gathering = new Gathering(firebase.database(), "MyRoom", false, (succes) => {
      console.log("join gathering");
      gathering.join(user.uid, user.displayName);

      gathering.onUpdated((count, users) => {
        test(count, users);
      });
      
    
    });
  }

  // /// at start
  // useEffect(() => {
  //   console.log(user.uid);
  //   const roomId = randomName();
  //   gathering = new Gathering(firebase.database(), "MyRoom", true, (succes) => {
  //     console.log("init gathering");
  //     gathering.join(user.uid, user.displayName);
  //     // gathering.onUpdated((count, users) => {
  //     //   test(count, users);
  //     // });
  //   });
  // }),
  //   [];

  return (
    <div>
      <TopBar displayName={user.displayName} />
      <button onClick={createRoom}>CREATE</button>
      <button onClick={joinRoom}>JOIN</button>
    </div>
  );
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
