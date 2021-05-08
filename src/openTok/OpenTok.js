import React from "react";
import { createSession } from "opentok-react";
import { config } from "./config";
import Publisher from "./components/Publisher";
import Subscriber from "./components/Subscriber";
import "./OpenTok.css";

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
const createSessionOnServer = () => {
  return new Promise((resolve, reject) => {
    getFromHttp(serverUrl + ":" + serverPort + "/CreateSession")
      .then((response) => {
        /// get sessionId from server
        const sessionId = response.sessionId;
        /// save the sessionId on Firebase
        // FB.db.ref(FB.adminUserId + "/OT/").set({ sessionId: sessionId });
        resolve(sessionId);
      })
      .catch((error) => {
        console.log("ERROR: " + error);
      });
  });
};

/// get a new user token from server
const getUserTokenFromServer = (sessionId) => {
  return new Promise((resolve, reject) => {
    getFromHttp(
      serverUrl + ":" + serverPort + "/GetToken?sessionId=" + sessionId
    )
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.log("ERROR: " + error);
      });
  });
};

///
/// OPENTOK
///
class OpenTok extends React.Component {
  constructor(props) {
    super(props);
    this.state = { streams: [], ready: false };
  }

  componentDidMount() {
    createSessionOnServer().then((sessionId) => {
      getUserTokenFromServer(sessionId).then((response) => {
        /// create the session
        this.sessionHelper = createSession({
          apiKey: response.apiKey,
          sessionId: response.sessionId,
          token: response.token,
          onStreamsUpdated: (streams) => {
            this.setState({ streams });
          },
        });

        this.sessionHelper.session.on("streamPropertyChanged", (event) => {
          const newStreams = this.state.streams.map((stream) => {
            if (stream.id === event.stream.id) {
              // return { ...stream, hasAudio: event.newValue };
              return event.stream;
            }
            return stream;
          });
          this.setState({ streams: newStreams });
        });

        this.setState({ ready: true });
      });
    });

    // this.sessionHelper = createSession({
    //   apiKey: config.apiKey,
    //   sessionId: config.sessionId,
    //   token: config.token,
    //   onStreamsUpdated: (streams) => {
    //     this.setState({ streams });
    //   },
    // });

    // this.sessionHelper.session.on("streamPropertyChanged", (event) => {
    //   const newStreams = this.state.streams.map((stream) => {
    //     if (stream.id === event.stream.id) {
    //       // return { ...stream, hasAudio: event.newValue };
    //       return event.stream;
    //     }
    //     return stream;
    //   });
    //   this.setState({ streams: newStreams });
    // });

    // this.setState({ ready: true });
  }

  componentWillUnmount() {
    this.sessionHelper.disconnect();
  }

  render() {
    if (!this.state.ready) return null;
    return (
      <div className="OpenTok">
        <Publisher session={this.sessionHelper.session} name="Daniele Suppo" />

        {this.state.streams.map((stream) => {
          return (
            <Subscriber
              key={stream.id}
              session={this.sessionHelper.session}
              stream={stream}
            />
          );
        })}
      </div>
    );
  }
}

export default OpenTok;
