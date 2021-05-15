import React from "react";

const ProgressBar = ({progress, fillColor}) => {

  const containerStyles = {
    height: 15,
    width: '100%',
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 50
  }

  const fillerStyles = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: `${fillColor}`,
    borderRadius: 'inherit',
    textAlign: 'right',
    transition: 'width 1s ease-in-out',
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 'small'
  }

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
