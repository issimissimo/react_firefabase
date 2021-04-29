import * as React from "react";
import { render } from "react-dom";
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
} from "@react-firebase/auth";
import { config } from "./firebaseConfig";

const email = "d.suppo@issimissimo.com";
const passw = "123456";

function LogOut(props) {
  return <button>Sign Out</button>;
}

function showUserData(data) {
  console.log(data);
}

//////////////////////
/// LOGIN FORM
//////////////////////
function LoginForm(props) {
  return (
    <form>
      <h1>Sign In</h1>
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

//////////////////////
/// REGISTRATION FORM
//////////////////////
function RegisterForm(props) {
  return (
    <form>
      <h1>Sign Up</h1>
      <label>
        First name:
        <input
          type="text"
          value={props.firstName}
          onChange={props.onChangeFirstName}
        />
      </label>
      <label>
        Last name:
        <input
          type="text"
          value={props.lastName}
          onChange={props.onChangeLastName}
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

//////////////////////
/// AUTHORIZATION FORM
//////////////////////
export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);

    this.AUTH_STATE = {
      REGISTER: "register",
      LOGIN: "login",
    };

    this.state = {
      authState: this.AUTH_STATE.LOGIN,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    };

    this.changeAuthState = this.changeAuthState.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  changeAuthState() {
    const newAuthState =
      this.state.authState === this.AUTH_STATE.LOGIN
        ? this.AUTH_STATE.REGISTER
        : this.AUTH_STATE.LOGIN;

    this.setState({ authState: newAuthState });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleChangeFirstName(event) {
    this.setState({ firstName: event.target.value });
  }

  handleChangeLastName(event) {
    this.setState({ lastName: event.target.value });
  }

  //   handleSubmit() {
  //     if (this.state.authState === this.AUTH_STATE.LOGIN) this.login();
  //     else this.register();
  //   }

  //   login() {
  //     console.log("login....");
  //   }

  //   register() {
  //     console.log("register....");
  //   }

  onAuth() {
    console.log("MA VIENI!!!");
  }

  render() {
    /// change auth state
    let changeAuthStateBttnText;
    let changeAuthStateText;
    if (this.state.authState === this.AUTH_STATE.LOGIN) {
      changeAuthStateText = "Not yet registered?";
      changeAuthStateBttnText = "Sign Up";
    } else {
      changeAuthStateText = "Already registered?";
      changeAuthStateBttnText = "Sign In";
    }

    /// create form
    let form;
    if (this.state.authState === this.AUTH_STATE.LOGIN) {
      form = (
        <LoginForm
          email={this.state.email}
          password={this.state.password}
          onChangeEmail={this.handleChangeEmail}
          onChangePassword={this.handleChangePassword}
        />
      );
    }
    if (this.state.authState === this.AUTH_STATE.REGISTER) {
      form = (
        <RegisterForm
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          email={this.state.email}
          password={this.state.password}
          onChangeFirstName={this.handleChangeFirstName}
          onChangeLastName={this.handleChangeLastName}
          onChangeEmail={this.handleChangeEmail}
          onChangePassword={this.handleChangePassword}
        />
      );
    }

    const email = this.state.email;
    const password = this.state.password;

    return (
      <div className="container">
        {form}

        <FirebaseAuthProvider {...config} firebase={firebase}>
          <div>
            <button
              onClick={() => {
                firebase.auth().signInWithEmailAndPassword(email, password);
              }}
            >
              SUBMIT
            </button>

            <FirebaseAuthConsumer>
              {({ isSignedIn, user, providerId }) => {
                console.log("firebase auth consumer - completato");
                this.onAuth();
                return (
                  <pre style={{ height: 300, overflow: "auto" }}>
                    {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
                  </pre>
                );
              }}
            </FirebaseAuthConsumer>
            <div>
              <IfFirebaseAuthed>
                {() => {
                  console.log("firebase authed - completato");
                  return <div>You are authenticated</div>;
                }}
              </IfFirebaseAuthed>
              <IfFirebaseAuthedAnd
                filter={({ providerId }) => providerId !== "anonymous"}
              >
                {({ providerId }) => {
                  console.log("yeaaaaaaaa");
                  return <div>You are authenticated with {providerId}</div>;
                }}
              </IfFirebaseAuthedAnd>
            </div>
          </div>
        </FirebaseAuthProvider>

        {/* <button onClick={this.handleSubmit}>SUBMIT</button> */}

        <p>{changeAuthStateText}</p>
        <button onClick={this.changeAuthState}>
          {changeAuthStateBttnText}
        </button>
      </div>
    );
  }
}

/////////////////////////////////////////
///// EXAMPLE
/////////////////////////////////////////
const App = () => {
  return (
    <FirebaseAuthProvider {...config} firebase={firebase}>
      <div>
        <button
          onClick={() => {
            firebase.auth().signInWithEmailAndPassword(email, passw);
          }}
        >
          Sign In with email and password
        </button>

        <button
          onClick={() => {
            const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(googleAuthProvider);
          }}
        >
          Sign In with Google
        </button>
        <button
          data-testid="signin-anon"
          onClick={() => {
            firebase.auth().signInAnonymously();
          }}
        >
          Sign In Anonymously
        </button>
        <button
          onClick={() => {
            firebase.auth().signOut();
          }}
        >
          Sign Out
        </button>
        <FirebaseAuthConsumer>
          {({ isSignedIn, user, providerId }) => {
            return (
              <pre style={{ height: 300, overflow: "auto" }}>
                {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
              </pre>
            );
          }}
        </FirebaseAuthConsumer>
        <div>
          <IfFirebaseAuthed>
            {() => {
              return <div>You are authenticated</div>;
            }}
          </IfFirebaseAuthed>
          <IfFirebaseAuthedAnd
            filter={({ providerId }) => providerId !== "anonymous"}
          >
            {({ providerId }) => {
              return <div>You are authenticated with {providerId}</div>;
            }}
          </IfFirebaseAuthedAnd>
        </div>
      </div>
    </FirebaseAuthProvider>
  );
};
// render(<App />, document.getElementById("ReactRoot"));
