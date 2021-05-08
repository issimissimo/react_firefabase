import React from "react";
import { createSession } from "opentok-react";
import Publisher from "./components/Publisher";
import Subscriber from "./components/Subscriber";
import { fetchFromServer } from "./OpenTokClient";
import "./OpenTok.css";

///
/// OPENTOK
///
class OpenTok extends React.Component {
  constructor(props) {
    super(props);
    this.state = { streams: [], ready: false };
  }

  componentDidMount() {
    fetchFromServer(this.props.adminUid, this.props.handleError).then(
      (response) => {
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
      }
    );
  }

  componentWillUnmount() {
    this.sessionHelper.disconnect();
  }

  render() {
    if (!this.state.ready) return null;
    return (
      <div className="OpenTok">
        <Publisher
          session={this.sessionHelper.session}
          name={this.props.name}
        />

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
