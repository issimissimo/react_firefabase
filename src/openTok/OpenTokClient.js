import firebase from "firebase/app";
import "firebase/database";

/// generic function to GET from server
const getFromHttp = (url) => {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status == 200) {
          var result = xhr.responseText;
          result = JSON.parse(result);
          resolve(result);
        } else {
          reject(xhr);
        }
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  });
};

const serverUrl = "https://test.issimissimo.com";
const serverPort = "4000";

/// create a new session on the server
const createSessionOnServer = (adminUid, handleError) => {
  return new Promise((resolve, reject) => {
    /// first check if sessionId exist on Firebase
    const dbRef = firebase.database().ref(adminUid + "/OpenTok");
    dbRef.once("value", (snapshot) => {
      if (snapshot.exists()) {
        const sessionId = snapshot.val().sessionId;
        console.log("Session Id already exist on Firebase");
        resolve(sessionId);
      } else {
        console.log("I have to create a new session Id....");
        /// create a new sessionId on server
        getFromHttp(serverUrl + ":" + serverPort + "/CreateSession")
          .then((response) => {
            /// get sessionId from server
            const sessionId = response.sessionId;
            /// save the sessionId on Firebase
            dbRef.set({ sessionId: sessionId });
            resolve(sessionId);
          })
          .catch((error) => {
            console.log("ERROR: " + error);
            handleError(error);
          });
      }
    });
  });
};

/// get a new user token from server
const getUserTokenFromServer = (sessionId, handleError) => {
  return new Promise((resolve, reject) => {
    getFromHttp(
      serverUrl + ":" + serverPort + "/GetToken?sessionId=" + sessionId
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log("ERROR: " + error);
        handleError(error);
      });
  });
};

export const fetchFromServer = (adminUid, handleError) => {
  return new Promise((resolve, reject) => {
    createSessionOnServer(adminUid, handleError).then((sessionId) => {
      getUserTokenFromServer(sessionId, handleError)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("ERROR: " + error);
          handleError(error);
        });
    });
  });
};
