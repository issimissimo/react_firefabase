import React, { Component } from 'react';

// import { OTSubscriber } from '../../src'
import { OTSubscriber } from 'opentok-react';
import CheckBox from './CheckBox';

export default class Subscriber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      audio: true,
      video: true
    };
  }

  setAudio = (audio) => {
    this.setState({ audio });
  }

  setVideo = (video) => {
    this.setState({ video });
  }

  onError = (err) => {
    this.setState({ error: `Failed to subscribe: ${err.message}` });
  }

  render() {
    return (
      <div className="VideoContainer">
        {/* {this.state.error ? <div>{this.state.error}</div> : null} */}
        <OTSubscriber
          properties={{
            subscribeToAudio: this.state.audio,
            subscribeToVideo: this.state.video,
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
        {/* <CheckBox
          label="Subscribe to Audio"
          initialChecked={this.state.audio}
          onChange={this.setAudio}
        />
        <CheckBox
          label="Subscribe to Video"
          initialChecked={this.state.video}
          onChange={this.setVideo}
        /> */}
      </div>
    );
  }
}
