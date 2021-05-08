import React, { Component } from "react";
import { OTSubscriber } from "opentok-react";
import OTOverlay from "./overlay/OTOverlay";
import "./VideoContainer.css";

export default class Subscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      // audio: true,
      // video: true,
    };

    this.subscriberEventHandlers = {
      streamCreated: (event) => {
        console.log("subscriber stream created");
        console.log(event.stream.id);
        // this.streamId = event.stream.id;
      },
    };
  }

  componentDidMount() {
    console.log("***************************");
    console.log("DID MOUNT SUBSCRIBER!");
    console.log(this.props.stream.hasAudio);
    console.log("***************************");
  }

  componentDidUpdate() {
    console.log("DID UPDATE SUBSCRIBER!");
  }

  // setAudio = (audio) => {
  //   this.setState({ audio });
  // }

  // setVideo = (video) => {
  //   this.setState({ video });
  // }

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
            // subscribeToAudio: this.state.audio,
            // subscribeToVideo: this.state.video,
            showControls: false,
            width: "100%",
            height: "100%",
            resolution: "320x240",
            frameRate: 15,
          }}
          eventHandlers={this.subscriberEventHandlers}
          onError={this.onError}
          retry={true}
          maxRetryAttempts={3}
          retryAttemptTimeout={2000}
        />
      </div>
    );
  }
}
