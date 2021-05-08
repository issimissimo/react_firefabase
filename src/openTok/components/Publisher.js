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
      },
      streamCreated: (event) => {
        console.log("publisher stream created");
        console.log(event.stream.id);
        this.streamId = event.stream.id;
      },
    };

    this.streamId = "";

    this.toggleAudio = this.toggleAudio.bind(this);
    this.toggleVideo = this.toggleVideo.bind(this);
  }

  toggleAudio = () => {
    this.setState({ audio: !this.state.audio });
  };

  toggleVideo = () => {
    this.setState({ video: !this.state.video });
  };

  componentDidUpdate(){
    console.log("DID UPDATE PUBLISHER!")
  }

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
          type="Publisher"
          name={this.props.name}
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
            name: this.props.name,
            id: "kjkdjkjkdhj",
          }}
          eventHandlers={this.publisherEventHandlers}
          onError={this.onError}
        />
      </div>
    );
  }
}
