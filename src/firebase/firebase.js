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
import Main from "./main";

const login = (email, password, handleError) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((cred) => {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    })
    .catch((err) => {
      handleError(err.message);
    });
};

const register = (fullName, email, password, isAdmin, handleError) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      cred.user
        .updateProfile({
          displayName: fullName,
        })
        .then(() => {
          if (isAdmin) {
            /// make the user an admin...
            const addAdminRole = firebase
              .functions()
              .httpsCallable("addAdminRole");

            addAdminRole({ email: email })
              .then(() => {
                /// sign out and sign in... (!)
                firebase.auth().signOut();
                login(email, password);
              })
              .catch((err) => {
                handleError(err.message);
              });
          } else {
            firebase.auth().signOut();
            login(email, password);
          }
          // /// make the user an admin...
          // const addAdminRole = firebase
          //   .functions()
          //   .httpsCallable("addAdminRole");

          // addAdminRole({ email: email })
          //   .then(() => {
          //     /// sign out and sign in... (!)
          //     firebase.auth().signOut();
          //     login(email, password);
          //   })
          //   .catch((err) => {
          //     handleError(err.message);
          //   });
        });
    })
    .catch((err) => {
      handleError(err.message);
    });
};

///
/// AUTH FORM CONTAINER
///
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
    // if (this.props.roomIdToJoin) {
    //   this.setState({ authState: this.AUTH_STATE.JOIN });
    // } else {
    //   this.setState({ authState: this.AUTH_STATE.LOGIN });
    // }
    this.setState({ authState: this.AUTH_STATE.LOGIN });
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

///
/// LOGIN FORM
///
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", error: null };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    login(this.state.email, this.state.password, (error) => {
      this.handleError(error);
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
          <UI.Bttn_Submit
            onSubmit={this.handleLogin}
            error={this.state.error}
          />

          {/*print error */}
          {this.state.error && (
            <p style={{ color: "red" }}>{this.state.error}</p>
          )}
        </form>

        <p>Not registered?</p>
        <button onClick={this.props.onChangeAuthState}>Sign Up</button>
        <UI.Bttn_Link name="Sign Up" />
      </div>
    );
  }
}

///
/// REGISTRATION FORM
///
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      email: "",
      password: "",
      isAdmin: false,
      error: null,
    };
    this.handleChangeFullName = this.handleChangeFullName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.handleChangeIsAdmin = this.handleChangeIsAdmin.bind(this);
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

  handleChangeIsAdmin(event) {}

  handleError(msg) {
    this.setState({ error: msg });
  }

  handleRegister() {
    if (this.state.fullName == "") {
      this.handleError("You didn't type your name");
      return;
    }
    register(
      this.state.fullName,
      this.state.email,
      this.state.password,
      this.state.isAdmin,
      (error) => {
        this.handleError(error);
      }
    );
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
          <label>
            {" "}
            Is Admin
            <input type="checkbox" onChange={this.handleChangeIsAdmin} />
          </label>
          <UI.Bttn_Submit
            onSubmit={this.handleRegister}
            error={this.state.error}
          />

          {/*print error */}
          {this.state.error && (
            <p style={{ color: "red" }}>{this.state.error}</p>
          )}
        </form>

        <p>
          Already registered? <span>UUUU</span>{" "}
        </p>
        <button onClick={this.props.onChangeAuthState}>Sign In</button>
      </div>
    );
  }
}

///
/// JOIN FORM
///
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

  handleError(msg) {
    this.setState({ error: msg });
  }

  join() {
    console.log("register...");
    if (this.state.fullName == "") {
      this.handleError("You didn't type your name");
      return;
    }
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
            if (isSignedIn && user.displayName) {
              if (providerId !== "anonymous") {
                return (
                  <div>
                    {/* <p>SIGNED IN WITH EMAIL AND PASSWORD</p> */}
                    <Main
                      myUser={user}
                      roomIdToJoin={this.props.roomIdToJoin}
                    />
                  </div>
                );
              } else {
                return (
                  <div>
                    {/* <p>SIGNED IN ANONIMOUSLY</p> */}
                    <Main myUser={user} />
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
