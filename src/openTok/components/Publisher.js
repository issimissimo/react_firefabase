import React, { Component } from "react";
import { OTPublisher } from "opentok-react";
import OTOverlay from "./overlay/OTOverlay";
import "../OpenTok.css";

export default class Publisher extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true,
    };

    this.publisherEventHandlers = {
      videoDisabled: (event) => {},
      videoEnabled: (event) => {},
      videoElementCreated: (event) => {},
      streamCreated: (event) => {},
    };

    this.toggleAudio = this.toggleAudio.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
  }

  toggleAudio = () => {
    this.setState({ audio: !this.state.audio });
  };

  toggleVideo = () => {
    this.setState({ video: !this.state.video });
  };

  onError = (err) => {
    console.error(err);
    this.setState({ error: `Failed to publish: ${err.message}` });
  };

  render() {
    return (
      <div className={`OpenTok-video OpenTok-video-publisher`}>
        <OTOverlay
          type="Publisher"
          name={this.props.name}
          audio={this.state.audio}
          video={this.state.video}
          toggleAudio={this.toggleAudio}
          toggleVideo={this.toggleVideo}
        />
        <OTPublisher
          session={this.props.session}
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
            name: this.props.name,
            custom: "myCustomProperty",
          }}
          eventHandlers={this.publisherEventHandlers}
          onError={this.onError}
        />
      </div>
    );
  }
}
