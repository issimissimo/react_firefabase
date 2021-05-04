import * as React from "react";

export class Bttn_Submit extends React.Component {
    constructor(props) {
      super(props);
      this.state = { clicked: false };
    }
  
    componentDidUpdate() {
      if (this.props.error && this.state.clicked) {
        this.setState({ clicked: false });
      }
    }
  
    render() {
      let content;
      if (!this.state.clicked) {
        content = (
          <button
            onClick={() => {
              this.setState({ clicked: true });
              this.props.onSubmit();
            }}
          >
            SUBMIT
          </button>
        );
      } else {
        content = <p>Submitting....</p>;
      }
  
      return <div className="bttn-submit">{content}</div>;
    }
  }