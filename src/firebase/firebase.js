import * as React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
} from "@react-firebase/auth";
import { config } from "./firebaseConfig";
import { Gathering } from "./gathering";
import * as UI from "../UI/buttons";

//////////////////////
/// LOGIN FORM
//////////////////////
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", error: null };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleError = this.handleError.bind(this);
    this.login = this.login.bind(this);
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((cred) => {})
      .catch((err) => {
        this.handleError(err.message);
      });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value, error: null });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value, error: null });
  }

  handleError(msg) {
    this.setState({ error: msg });
  }

  render() {
    return (
      <div>
        <form>
          <h1>Sign In</h1>
          <label>
            Email:
            <input
              type="email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
            />
          </label>
          <UI.Bttn_Submit onSubmit={this.login} error={this.state.error} />

          {/*print error */}
          {this.state.error && (
            <p style={{ color: "red" }}>{this.state.error}</p>
          )}
        </form>

        <p>Not registered?</p>
        <button onClick={this.props.onChangeAuthState}>Sign Up</button>
      </div>
    );
  }
}

//////////////////////
/// REGISTRATION FORM
//////////////////////
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fullName: "", email: "", password: "", error: null };
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleError = this.handleError.bind(this);
    this.register = this.register.bind(this);
  }

  handleChangeFullName(event) {
    this.setState({ fullName: event.target.value, error: null });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value, error: null });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value, error: null });
  }

  handleError(msg) {
    this.setState({ error: msg });
  }

  register() {
    console.log("register...");
    console.log(this.state.fullName);
    if (this.state.fullName == "") {
      this.handleError("You didn't type your name");
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((cred) => {
        // this.setState({ errorMessage: null });
        cred.user
          .updateProfile({
            displayName: this.fullName,
          })
          .then(() => {
            /// make the user an admin...
            const addAdminRole = firebase
              .functions()
              .httpsCallable("addAdminRole");

            addAdminRole({ email: this.state.email })
              .then(() => {
                console.log(
                  this.state.email + " has been registered as Administrator!"
                );
                // firebase.auth().signOut();
                // this.login();
              })
              .catch((err) => {
                this.handleError(err.message);
              });
          });
      })
      .catch((err) => {
        this.handleError(err.message);
      });
  }

  render() {
    return (
      <div>
        <form>
          <h1>Sign Up</h1>
          <label>
            Full name:
            <input
              type="text"
              value={this.state.fullName}
              onChange={this.handleChangeFullName}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
            />
          </label>
          <UI.Bttn_Submit onSubmit={this.register} error={this.state.error} />

          {/*print error */}
          {this.state.error && (
            <p style={{ color: "red" }}>{this.state.error}</p>
          )}
        </form>

        <p>Already registered?</p>
        <button onClick={this.props.onChangeAuthState}>Sign In</button>
      </div>
    );
  }
}

//////////////////////
/// JOIN FORM
//////////////////////
class JoinForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fullName: "", error: null };
    this.join = this.join.bind(this);
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleChangeFullName(event) {
    this.setState({ fullName: event.target.value, error: null });
  }

  handleError() {
    this.setState({ error: "error message" });
  }

  join() {
    firebase.auth().signInAnonymously();
  }

  render() {
    return (
      <form>
        <h1>Join</h1>
        <label>
          Full name:
          <input
            type="text"
            value={this.state.fullName}
            onChange={this.handleChangeFullName}
          />
        </label>
        <UI.Bttn_Submit onSubmit={this.join} error={this.state.error} />

        {/*print error */}
        {this.state.error && <p style={{ color: "red" }}>{this.state.error}</p>}
      </form>
    );
  }
}

//////////////////////
/// AUTH FORM CONTAINER
//////////////////////
class AuthForm extends React.Component {
  constructor(props) {
    super(props);

    this.AUTH_STATE = {
      REGISTER: "register",
      LOGIN: "login",
      JOIN: "join",
    };

    this.state = {
      authState: null,
    };

    this.handleChangeAuthState = this.handleChangeAuthState.bind(this);
  }

  componentDidMount() {
    if (this.props.roomIdToJoin) {
      this.setState({ authState: this.AUTH_STATE.JOIN });
    } else {
      this.setState({ authState: this.AUTH_STATE.LOGIN });
    }
  }

  handleChangeAuthState() {
    const newAuthState =
      this.state.authState === this.AUTH_STATE.LOGIN
        ? this.AUTH_STATE.REGISTER
        : this.AUTH_STATE.LOGIN;

    this.setState({ authState: newAuthState });
  }

  render() {
    let form;
    if (this.state.authState === this.AUTH_STATE.LOGIN) {
      form = <LoginForm onChangeAuthState={this.handleChangeAuthState} />;
    }
    if (this.state.authState === this.AUTH_STATE.REGISTER) {
      form = <RegisterForm onChangeAuthState={this.handleChangeAuthState} />;
    }
    if (this.state.authState === this.AUTH_STATE.JOIN) {
      form = <JoinForm />;
    }

    return <div className="auth-container">{form}</div>;
  }
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

//////////////////////
/// APP
//////////////////////
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayName: "" };
  }

  render() {
    return (
      <FirebaseAuthProvider {...config} firebase={firebase}>
        <FirebaseAuthConsumer>
          {({ isSignedIn, user, providerId }) => {
            if (isSignedIn) {
              console.log(providerId);
              if (providerId !== "anonymous") {
                return (
                  <div>
                    {/* <p>SIGNED IN WITH EMAIL AND PASSWORD</p> */}
                    <Main user={user} />
                  </div>
                );
              } else {
                return (
                  <div>
                    {/* <p>SIGNED IN ANONIMOUSLY</p> */}
                    <Main user={user} />
                  </div>
                );
              }
            }
            return (
              <div>
                {/* <p>NOT SIGNED IN</p> */}
                <AuthForm roomIdToJoin={this.props.roomIdToJoin} />
              </div>
            );
          }}
        </FirebaseAuthConsumer>
      </FirebaseAuthProvider>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////

function TopBar(props) {
  return (
    <div className="top-bar">
      <div style={{ display: "flex" }}>
        <p>{props.displayName}</p>
        <button
          onClick={() => {
            firebase.auth().signOut();
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

//////////////////////
/// MAIN WINDOW
//////////////////////
class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <TopBar displayName={this.props.user.displayName} />;
  }
}
