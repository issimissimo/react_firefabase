/**
 * A Javascript module to keep list (and count) of online users in a Firebase web app - by isolated rooms or globally.
 *
 * Initial idea from - http://stackoverflow.com/a/15982583/228648
 *
 * @url : https://gist.github.com/ajaxray/17d6ec5107d2f816cc8a284ce4d7242e
 * @auther : Anis Uddin Ahmad <anis.programmer@gmail.com>
 * @auther : Daniele Suppo <d.suppo@issimissimo.com>
 *
 * w:ajaxray.com | t:@ajaxray
 */
export const Gathering = (function () {
  var randomName = function () {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 5);
  };

  function Gathering(databaseReference, roomName, isAdmin, callback = null) {
    /// internal variables and functions
    this.db = databaseReference;
    this.roomName = roomName || "globe";
    this.isAdmin = isAdmin;
    this.callback = callback;
    this.success;
    this.makeGathering = function () {
      this.room = this.db.ref(
        "gatherings/" + encodeURIComponent(this.roomName)
      );
      this.myName = "";
      this.user = null;
      this.id = null;
      this.success = true;
      if (this.callback) this.callback(this.success);
    };

    /// check if the room exist or not,
    /// depending if we are admin or not
    var _room = this.db.ref("gatherings");
    _room.once("value").then((snapshot) => {
      
      if (this.isAdmin) {
        console.log("QUI E' ADMIN")

        this.makeGathering();

        /// ***************************************************
        /// if the room ALREADY EXIST we can't proceed
        /// (this should never happen)
        // if (snapshot.hasChild(roomName)) {
        //   console.log("the room already exist!!!")
        //   this.success = false;
        //   this.callback(this.success);
        // }
        // /// the don't room exist, proceed
        // else {
        //   this.makeGathering();
        // }
        /// ***************************************************


      } else {
        console.log("QUI NON E' ADMIN")
        console.log("cerchiamo se esiste " + roomName)
        /// if the room don't exist we can't proceed
        if (!snapshot.hasChild(roomName)) {
          console.log("NON ESISTE!")
          console.log(snapshot.val())
          this.success = false;
          this.callback(this.success);
        }
        /// the room exist, proceed
        else {
          this.makeGathering();
        }
      }
    });

    this.join = function (uid, displayName) {
      if (this.user) {
        console.error("Already joined.");
        return false;
      }
      this.myName = displayName || "Anonymous - " + randomName();
      this.user = uid ? this.room.child(uid) : this.room.push();
      this.isActive = isAdmin ? true : false;

      /// get ID of the new entry in the DB
      let st = this.user.toString();
      st = st.split("/");
      this.id = st[st.length - 1];
      console.log(
        "You joined the Room! Your ID in the RealTime DB is: " + this.id
      );

      // Add user to presence list when online.
      var self = this;
      var presenceRef = this.db.ref(".info/connected");
      presenceRef.on("value", function (snap) {
        if (snap.val()) {
          /// *****************************************************
          /// PER ORA QUESTO LO
          /// DOBBIAMO DISATTIVARE!!!!
          // self.user.onDisconnect().remove();
          /// *****************************************************
          self.user.set({
            name: self.myName,
            isActive: self.isActive,
            isAdmin: self.isAdmin,
          });
        }
      });

      return this.myName;
    };

    this.leave = function () {
      if (this.user) {
        console.log("remove")
        this.user.remove();
        this.user = null;
        this.myName = "";
      }
    };

    // this.remove = function(id){

    // }

    this.over = function () {
      console.log("over")
      this.room.remove();
    };

    this.onUpdated = function (callback) {
      if ("function" == typeof callback) {
        this.room.on("value", function (snap) {
         
          let users = [];
          const result = snap.val();
          for (let id in result) {
            let newUser = result[id];
            newUser.uid = id;
            users.push(newUser);
          }

          // console.log(users)
          
          callback(users);
        //   callback(snap.numChildren(), snap.val());
        });
      } else {
        console.error(
          "You have to pass a callback function to onUpdated(). That function will be called (with user count and hash of users as param) every time the user list changed."
        );
      }
    };
  }

  return Gathering;
})();
