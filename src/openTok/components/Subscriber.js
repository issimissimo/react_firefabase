import React, { Component } from "react";
import { OTSubscriber } from "opentok-react";
import OTOverlay from "./overlay/OTOverlay";
import "./VideoContainer.css";

export default class Subscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  onError = (err) => {
    this.setState({ error: `Failed to subscribe: ${err.message}` });
  };

  render() {
    return (
      <div className="VideoContainer">
        {/* {this.state.error ? <div>{this.state.error}</div> : null} */}
        <OTOverlay
          type="Subscriber"
          name="Subscriber"
          audio={this.props.stream.hasAudio}
        />
        <OTSubscriber
          session={this.props.session}
          stream={this.props.stream}
          properties={{
            showControls: false,
            width: "100%",
            height: "100%",
            resolution: "320x240",
            frameRate: 15,
          }}
          onError={this.onError}
          retry={true}
          maxRetryAttempts={3}
          retryAttemptTimeout={2000}
        />
      </div>
    );
  }
}
