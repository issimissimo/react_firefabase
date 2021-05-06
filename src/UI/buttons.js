import React, { useState } from "react";
import "./buttons.css";

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

export function Bttn_Link({ name, onClick }) {
  const [isOver, setIsOver] = useState(false);
  const styles = [
    { color: "black" },
    { color: "blue", textDecoration: "underline" },
  ];
  const defStyle = { cursor: "pointer" };
  const changeStyle = () => {
    setIsOver(!isOver);
  };
  return (
    <p
      style={Object.assign(defStyle, isOver ? styles[1] : styles[0])}
      onClick={onClick}
      onMouseOver={changeStyle}
      onMouseLeave={changeStyle}
    >
      {name}
    </p>
  );
}
