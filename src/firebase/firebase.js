import * as React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd,
} from "@react-firebase/auth";
import { config } from "./firebaseConfig";
import { Gathering } from "./gathering";

const email = "d.suppo@issimissimo.com";
const passw = "123456";

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
class AuthForm extends React.Component {
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
      errorMessage: null,
    };

    this.changeAuthState = this.changeAuthState.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeFirstName = this.handleChangeFirstName.bind(this);
    this.handleChangeLastName = this.handleChangeLastName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  componentDidMount() {
    ///listen for auth status changes
    firebase.auth().onAuthStateChanged((user) => {
      console.log("---- user changed ----");
      let uid = null;
      let displayName = "";
      let isAdmin = false;
      if (user) {
        uid = user.uid;
        displayName = user.displayName;

        /// check if user is admin
        user.getIdTokenResult().then((idTokenResult) => {
          if (idTokenResult.claims.admin) isAdmin = true;

          this.props.onUserChange(uid, displayName, isAdmin);
        });
      } else {
        console.log("NO USER!");
        this.props.onUserChange(null, "", false);
      }
    });
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

  handleSubmit() {
    if (this.state.authState === this.AUTH_STATE.LOGIN) this.login();
    else this.register();
  }

  login() {
    const email = this.state.email;
    const password = this.state.password;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((cred) => {
        this.setState({ errorMessage: null });
      })
      .catch((err) => {
        console.error(err.message);
        this.setState({ errorMessage: err.message });
      });
  }

  register() {
    console.log("register....");
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

    const error = this.state.errorMessage;

    return (
      <div className="container">
        {form}

        <FirebaseAuthProvider {...config} firebase={firebase}>
          <div>
            <button onClick={this.handleSubmit}>SUBMIT</button>

            <FirebaseAuthConsumer>
              {({ isSignedIn, user, providerId }) => {
                console.log("firebase auth consumer - completato");
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

        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>{changeAuthStateText}</p>
        <button onClick={this.changeAuthState}>
          {changeAuthStateBttnText}
        </button>

        {/* <button onClick={this.logout}>Sign Out</button> */}
      </div>
    );
  }
}

// /////////////////////////////////////////
// ///// EXAMPLE
// /////////////////////////////////////////
// const App = () => {
//   return (
//     <FirebaseAuthProvider {...config} firebase={firebase}>
//       <div>
//         <button
//           onClick={() => {
//             firebase.auth().signInWithEmailAndPassword(email, passw);
//           }}
//         >
//           Sign In with email and password
//         </button>

//         <button
//           onClick={() => {
//             const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
//             firebase.auth().signInWithPopup(googleAuthProvider);
//           }}
//         >
//           Sign In with Google
//         </button>
//         <button
//           data-testid="signin-anon"
//           onClick={() => {
//             firebase.auth().signInAnonymously();
//           }}
//         >
//           Sign In Anonymously
//         </button>
//         <button
//           onClick={() => {
//             firebase.auth().signOut();
//           }}
//         >
//           Sign Out
//         </button>
//         <FirebaseAuthConsumer>
//           {({ isSignedIn, user, providerId }) => {
//             return (
//               <pre style={{ height: 300, overflow: "auto" }}>
//                 {JSON.stringify({ isSignedIn, user, providerId }, null, 2)}
//               </pre>
//             );
//           }}
//         </FirebaseAuthConsumer>
//         <div>
//           <IfFirebaseAuthed>
//             {() => {
//               return <div>You are authenticated</div>;
//             }}
//           </IfFirebaseAuthed>
//           <IfFirebaseAuthedAnd
//             filter={({ providerId }) => providerId !== "anonymous"}
//           >
//             {({ providerId }) => {
//               return <div>You are authenticated with {providerId}</div>;
//             }}
//           </IfFirebaseAuthedAnd>
//         </div>
//       </div>
//     </FirebaseAuthProvider>
//   );
// };
// render(<App />, document.getElementById("ReactRoot"));

function TopBar(props) {
  const logout = () => {
    firebase.auth().signOut();
  };
  return (
    <div className="top-bar">
      <div style={{ display: "flex" }}>
        <p>{props.displayName}</p>
        <button onClick={logout}>Sign Out</button>
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

//////////////////////
/// APP
//////////////////////
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { uid: null, displayName: "", isAdmin: false },
    };
    this.handleUserChange = this.handleUserChange.bind(this);
  }
  handleUserChange(_uid, _displayName, _isAdmin) {
    this.setState({
      user: { uid: _uid, displayName: _displayName, isAdmin: _isAdmin },
    });
  }

  render() {
    const content = this.state.user.uid ? (
      <Main user={this.state.user} />
    ) : (
      <AuthForm onUserChange={this.handleUserChange} />
    );
    return <div>{content}</div>;
  }
}
