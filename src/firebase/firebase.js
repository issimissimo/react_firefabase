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
    this.bttnSubmit = React.createRef();
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((cred) => {
        // this.setState({ errorMessage: null });
      })
      .catch((err) => {
        console.error(err.message);
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
    console.log("error detected...");
    this.setState({ error: msg });
    this.bttnSubmit.current.reset();
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
          <Bttn_Submit onSubmit={this.login} ref={this.bttnSubmit} />
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
function RegisterForm(props) {
  return (
    <form>
      <h1>Sign Up</h1>
      <label>
        Full name:
        <input
          type="text"
          value={props.fullName}
          onChange={props.onChangeFullName}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={props.email}
          onChange={props.onChangeEmail}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={props.password}
          onChange={props.onChangePassword}
        />
      </label>
    </form>
  );
}

class Bttn_Submit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  reset() {
    this.setState({ clicked: false });
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

//////////////////////
/// JOIN FORM
//////////////////////
class JoinForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
    this.bttnSubmit = React.createRef();
  }

  // handleSubmit() {
  //   console.log("Submitting from Join Form...");
  //   setTimeout(() => {
  //     this.handleError();
  //   }, 3000);
  // }

  handleError() {
    console.log("error detected...");
    this.setState({ error: "error message" });
    this.bttnSubmit.current.reset();
  }

  render() {
    return (
      <form>
        <h1>Join</h1>
        <label>
          Full name:
          <input
            type="text"
            value={this.props.fullName}
            onChange={this.props.onChangeFullName}
            // onSubmit={this.handleSubmit}
          />
        </label>
        <Bttn_Submit onSubmit={this.props.onSubmit} ref={this.bttnSubmit} />
      </form>
    );
  }
}

const joinNew = () => {
  console.log("JOIN");
  firebase.auth().signInAnonymously();
};

//////////////////////
/// AUTH FORM
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
      authState: "",
      email: "",
      password: "",
      fullName: "",
      lastName: "",
      errorMessage: null,
    };

    this.handleChangeAuthState = this.handleChangeAuthState.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.join = this.join.bind(this);
  }

  componentDidMount() {
    if (this.props.roomIdToJoin) {
      this.setState({ authState: this.AUTH_STATE.JOIN });
    } else {
      this.setState({ authState: this.AUTH_STATE.LOGIN });
    }
  }

  componentWillUnmount() {}

  handleChangeAuthState() {
    const newAuthState =
      this.state.authState === this.AUTH_STATE.LOGIN
        ? this.AUTH_STATE.REGISTER
        : this.AUTH_STATE.LOGIN;

    this.setState({ authState: newAuthState });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value, errorMessage: null });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value, errorMessage: null });
  }

  handleChangeFullName(event) {
    this.setState({ fullName: event.target.value });
  }

  handleSubmit() {
    if (this.state.authState === this.AUTH_STATE.LOGIN) this.login();
    if (this.state.authState === this.AUTH_STATE.REGISTER) this.register();
    if (this.state.authState === this.AUTH_STATE.JOIN) this.join();
  }

  //////
  // join
  //////
  join() {
    console.log(this.state.fullName);
    // firebase.auth().signInAnonimously();
    joinNew();
  }

  //////
  // login
  //////
  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((cred) => {
        // this.setState({ errorMessage: null });
      })
      .catch((err) => {
        console.error(err.message);
        this.setState({ errorMessage: err.message });
      });
  }

  //////
  // logout
  //////
  logout() {
    this.props.onSignedOut();
  }

  //////
  // register
  //////
  register() {
    console.log(">>> START REGISTRATION ----");
    console.log(this.acceptAuthStatusChanged);

    if (this.state.firstName == "" || this.state.lastName == "") {
      this.setState({
        errorMessage: "You didn't type First name and Last name",
      });
      return;
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((cred) => {
        // this.setState({ errorMessage: null });
        cred.user
          .updateProfile({
            displayName: this.state.firstName + " " + this.state.lastName,
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
                firebase.auth().signOut();
                this.acceptAuthStatusChanged = true;
                this.login();
              })
              .catch((err) => {
                console.error(err.message);
              });
          });
      })
      .catch((err) => {
        console.error(err.message);
        this.setState({ errorMessage: err.message });
      });
  }

  render() {
    // let changeAuthStateBttnText;
    // let changeAuthStateText;
    // if (this.state.authState === this.AUTH_STATE.LOGIN) {
    //   changeAuthStateText = "Not yet registered?";
    //   changeAuthStateBttnText = "Sign Up";
    // } else {
    //   changeAuthStateText = "Already registered?";
    //   changeAuthStateBttnText = "Sign In";
    // }

    /// create form
    let form;
    if (this.state.authState === this.AUTH_STATE.LOGIN) {
      form = (
        <LoginForm
          // email={this.state.email}
          // password={this.state.password}
          // onChangeEmail={this.handleChangeEmail}
          // onChangePassword={this.handleChangePassword}
          // onSubmit={this.login}
          onChangeAuthState={this.handleChangeAuthState}
        />
      );
    }
    if (this.state.authState === this.AUTH_STATE.REGISTER) {
      form = (
        <RegisterForm
          fullName={this.state.fullName}
          email={this.state.email}
          password={this.state.password}
          onChangeFullName={this.handleChangeFullName}
          onChangeEmail={this.handleChangeEmail}
          onChangePassword={this.handleChangePassword}
        />
      );
    }
    if (this.state.authState === this.AUTH_STATE.JOIN) {
      form = (
        <JoinForm
          fullName={this.state.fullName}
          onChangeFullName={this.handleChangeFullName}
          onSubmit={this.join}
        />
      );
    }

    // const error = this.state.errorMessage;

    return (
      <div className="container">
        {form}

        {/*print error */}
        {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

        {/* <p>{changeAuthStateText}</p>
        <button onClick={this.changeAuthState}>
          {changeAuthStateBttnText}
        </button> */}
      </div>
    );
  }
}

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
                    <p>SIGNED IN WITH EMAIL AND PASSWORD</p>
                    <Main user={user} />
                  </div>
                );
              } else {
                return (
                  <div>
                    <p>SIGNED IN ANONIMOUSLY</p>
                    <Main />
                  </div>
                );
              }
            }
            return (
              <div>
                <p>NOT SIGNED IN</p>
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

function Bttn_SignOut() {
  const signOut = () => {
    firebase.auth().signOut();
  };
  return <button onClick={signOut}>Sign Out</button>;
}

function TopBar(props) {
  return (
    <div className="top-bar">
      <div style={{ display: "flex" }}>
        <p>{props.displayName}</p>
        <Bttn_SignOut />
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
