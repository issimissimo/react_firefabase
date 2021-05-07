import React, { Component } from "react";
import { OTPublisher } from "opentok-react";
import OTOverlay from "./overlay/OTOverlay";
import "./VideoContainer.css";

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

    this.toggleAudio = this.toggleAudio.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
  }

  toggleAudio = () => {
    console.log("toggle audio")
    this.setState({ audio: !this.state.audio });
  };

  toggleVideo = () => {
    this.setState({ video: !this.state.video });
  };

  // setVideoSource = (videoSource) => {
  //   this.setState({ videoSource });
  // };

  onError = (err) => {
    console.error(err);
    this.setState({ error: `Failed to publish: ${err.message}` });
  };

  render() {
    return (
      <div className="VideoContainer">
        <OTOverlay
          name="Daniele Suppo"
          audio={this.state.audio}
          video={this.state.video}
          toggleAudio={this.toggleAudio}
          toggleVideo={this.toggleVideo}
        />
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
