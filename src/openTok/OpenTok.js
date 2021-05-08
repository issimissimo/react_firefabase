import React, { useState } from "react";
import { OTSession, OTStreams } from "opentok-react";
import { config } from "./config";
import Publisher from "./components/Publisher";
import Subscriber from "./components/Subscriber";
import "./OpenTok.css";

class OpenTok extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      connected: false,
      newSubscriberId: null,
      streamChanged: null,
      newStreamValue: null,
    };

    this.sessionEvents = {
      sessionConnected: () => {
        this.setState({ connected: true });
      },
      sessionDisconnected: () => {
        this.setState({ connected: false });
      },

      streamPropertyChanged: (event) => {
        console.log(event.changedProperty);
        console.log(event.newValue);
        console.log(event.stream.name);
        console.log(event.stream.id);
        this.setState({
          streamChanged: event.stream.id,
          newStreamValue: event.newValue,
        });
      },

      streamCreated: (event) => {
        console.log("STREAM CREATED");
        console.log(event.stream.id);
        this.setState({newSubscriberId: event.stream.id})
      }
    };
  }

  componentDidUpdate() {
    console.log("DID UPDATE SESSION!");
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
          <Publisher name="Daniele Suppo" />
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

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

class _OpenTok extends React.Component {
  constructor(props) {
    super(props);
    this.state = { streams: [] };
  }

  componentWillMount() {
    this.sessionHelper = createSession({
      apiKey: config.apiKey,
      sessionId: config.sessionId,
      token: config.token,
      onStreamsUpdated: streams => { this.setState({ streams }); }
    });
  }

  componentWillUnmount() {
    this.sessionHelper.disconnect();
  }

  render() {
    return (
      <div>
        <OTPublisher session={this.sessionHelper.session} />

        {this.state.streams.map(stream => {
          return (
            <OTSubscriber
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