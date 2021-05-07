import React, { Component } from "react";

// import { OTPublisher } from '../../src'
import { OTPublisher } from "opentok-react";
import RadioButtons from "./RadioButtons";
import CheckBox from "./CheckBox";
import "./VideoContainer.css";
import OTOverlay from "./overlay/OTOverlay"

export default class Publisher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true,
      videoSource: "camera",
    };

    this.publisherEventHandlers = {
      videoDisabled: (event) => {
        console.log("Subscriber video disabled!");
      },
      videoEnabled: (event) => {
        console.log("Subscriber video enabled!");
      },
      videoElementCreated: (event) => {
        console.log("video element created");
        console.log(event.element);
      },
    };
  }

  setAudio = (audio) => {
    this.setState({ audio });
  };

  setVideo = (video) => {
    this.setState({ video });
  };

  setVideoSource = (videoSource) => {
    this.setState({ videoSource });
  };

  onError = (err) => {
    this.setState({ error: `Failed to publish: ${err.message}` });
  };

  render() {
    return (
      <div className="VideoContainer">
        <OTOverlay name='Daniele Suppo'/>
        <OTPublisher
          properties={{
            publishAudio: this.state.audio,
            publishVideo: this.state.video,
            videoSource:
              this.state.videoSource === "screen" ? "screen" : undefined,
            showControls: false,
            width: "100%",
            height: "100%",
            resolution: "320x240",
            frameRate: 15,
          }}
          eventHandlers={this.publisherEventHandlers}
          onError={this.onError}
        />
      </div>
    );
  }
}
