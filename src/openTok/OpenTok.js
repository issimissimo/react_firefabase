import React, { useState } from "react";
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from "opentok-react";
import { config } from "./config";
import ConnectionStatus from "./components/ConnectionStatus";
import Publisher from "./components/Publisher";
import Subscriber from "./components/Subscriber";
import "./OpenTok.css";

class OpenTok extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      connected: false,
    };

    this.sessionEvents = {
      sessionConnected: () => {
        this.setState({ connected: true });
      },
      sessionDisconnected: () => {
        this.setState({ connected: false });
      },
    };
  }

  onError = (err) => {
    this.setState({ error: `Failed to connect: ${err.message}` });
  };

  render() {
    return (
      <div className="OpenTok">
        <OTSession
          apiKey={config.apiKey}
          sessionId={config.sessionId}
          token={config.token}
          eventHandlers={this.sessionEvents}
          onError={this.onError}
        >
          {/* {this.state.error ? <div>{this.state.error}</div> : null}
          <ConnectionStatus connected={this.state.connected} /> */}
          <Publisher />
          <div className="Streams">
            <OTStreams>
              <Subscriber />
            </OTStreams>
          </div>
        </OTSession>
      </div>
    );
  }
}

export default OpenTok;
