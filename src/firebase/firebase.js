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
  }

  login() {
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((cred) => {
        // this.setState({ errorMessage: null });
      })
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
          <Bttn_Submit onSubmit={this.login} error={this.state.error} />

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
          <Bttn_Submit onSubmit={this.register} error={this.state.error} />

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

class Bttn_Submit extends React.Component {
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

//////////////////////
/// JOIN FORM
//////////////////////
class JoinForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.join = this.join.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  join() {
    firebase.auth().signInAnonymously();
  }

  handleError() {
    this.setState({ error: "error message" });
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
          />
        </label>
        <Bttn_Submit onSubmit={this.join} error={this.state.error} />
      </form>
    );
  }
}

// const joinNew = () => {
//   console.log("JOIN");
//   firebase.auth().signInAnonymously();
// };

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
      // email: "",
      // password: "",
      // fullName: "",
      // lastName: "",
      // errorMessage: null,
    };

    this.handleChangeAuthState = this.handleChangeAuthState.bind(this);
    // this.handleChangeEmail = this.handleChangeEmail.bind(this);
    // this.handleChangePassword = this.handleChangePassword.bind(this);
    // this.handleChangeFullName = this.handleChangeFullName.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.logout = this.logout.bind(this);
    // this.register = this.register.bind(this);
    // this.join = this.join.bind(this);
  }

  componentDidMount() {
    console.log("MOUNT!!!!");
    if (this.props.roomIdToJoin) {
      this.setState({ authState: this.AUTH_STATE.JOIN });
    } else {
      this.setState({ authState: this.AUTH_STATE.LOGIN });
    }
  }

  // componentDidUpdate() {
  //   console.log("state: " + this.state.authState);
  // }

  // componentWillUnmount() {}

  handleChangeAuthState() {
    const newAuthState =
      this.state.authState === this.AUTH_STATE.LOGIN
        ? this.AUTH_STATE.REGISTER
        : this.AUTH_STATE.LOGIN;

    this.setState({ authState: newAuthState });
  }

  // handleChangeEmail(event) {
  //   this.setState({ email: event.target.value, errorMessage: null });
  // }

  // handleChangePassword(event) {
  //   this.setState({ password: event.target.value, errorMessage: null });
  // }

  // handleChangeFullName(event) {
  //   this.setState({ fullName: event.target.value });
  // }

  // handleSubmit() {
  //   if (this.state.authState === this.AUTH_STATE.LOGIN) this.login();
  //   if (this.state.authState === this.AUTH_STATE.REGISTER) this.register();
  //   if (this.state.authState === this.AUTH_STATE.JOIN) this.join();
  // }

  //////
  // join
  //////
  // join() {
  //   console.log(this.state.fullName);
  //   // firebase.auth().signInAnonimously();
  //   joinNew();
  // }

  //////
  // login
  //////
  // login() {
  //   firebase
  //     .auth()
  //     .signInWithEmailAndPassword(this.state.email, this.state.password)
  //     .then((cred) => {
  //       // this.setState({ errorMessage: null });
  //     })
  //     .catch((err) => {
  //       console.error(err.message);
  //       this.setState({ errorMessage: err.message });
  //     });
  // }

  //////
  // logout
  //////
  logout() {
    this.props.onSignedOut();
  }

  //////
  // register
  //////
  // register() {
  //   console.log(">>> START REGISTRATION ----");
  //   console.log(this.acceptAuthStatusChanged);

  //   if (this.state.firstName == "" || this.state.lastName == "") {
  //     this.setState({
  //       errorMessage: "You didn't type First name and Last name",
  //     });
  //     return;
  //   }
  //   firebase
  //     .auth()
  //     .createUserWithEmailAndPassword(this.state.email, this.state.password)
  //     .then((cred) => {
  //       // this.setState({ errorMessage: null });
  //       cred.user
  //         .updateProfile({
  //           displayName: this.state.firstName + " " + this.state.lastName,
  //         })
  //         .then(() => {
  //           /// make the user an admin...
  //           const addAdminRole = firebase
  //             .functions()
  //             .httpsCallable("addAdminRole");

  //           addAdminRole({ email: this.state.email })
  //             .then(() => {
  //               console.log(
  //                 this.state.email + " has been registered as Administrator!"
  //               );
  //               firebase.auth().signOut();
  //               this.acceptAuthStatusChanged = true;
  //               this.login();
  //             })
  //             .catch((err) => {
  //               console.error(err.message);
  //             });
  //         });
  //     })
  //     .catch((err) => {
  //       console.error(err.message);
  //       this.setState({ errorMessage: err.message });
  //     });
  // }

  render() {
    let form;
    if (this.state.authState === this.AUTH_STATE.LOGIN) {
      form = <LoginForm onChangeAuthState={this.handleChangeAuthState} />;
    }
    if (this.state.authState === this.AUTH_STATE.REGISTER) {
      form = <RegisterForm onChangeAuthState={this.handleChangeAuthState} />;
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
