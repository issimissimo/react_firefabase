import React from 'react';
// import ReactDOM from 'react-dom';

const Print = (props) => {
    return (
        <h2>
            {props.author}, Hello to React!!!
        </h2>

    );
}


class LikeButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { liked: false };
    }

    render() {
        if (this.state.liked) {
            return (
                <div>
                    <p>You liked this</p>
                    <p>CIAO {this.props.author}</p>
                </div>

            )
        }

        return (
            <div>
                <button onClick={() => this.setState({ liked: true })}>
                    Like
                </button>
                <p>CIAO</p>
            </div>
        );

    }
}



export default LikeButton;