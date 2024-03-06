const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./connection");
const bcrypt = require("bcrypt");

passport.use(
  //Standard local strategy which relies on an encrypted password and email from the database
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    (email, password, done) => {
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, users) => {
          if (err) {
            return done(err);
          }
          //Although there can't be many users with the same email it will default to the first if there is
          const user = users && users[0];
          if (!user) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }
          //Compare the password given by the front end to the decrypted password from the database
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return done(err);
            }

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Incorrect username or password.",
              });
            }
          });
        }
      );
    }
  )
);

//Serialising a session is important for storing the logged in users
passport.serializeUser((user, cb) => {
  cb(null, user.user_id);
});
//As is deserialising a session
passport.deserializeUser((id, cb) => {
  connection.query(
    "SELECT * FROM users WHERE user_id = ?",
    [id],
    (err, users) => {
      if (err) {
        return cb(err);
      }
      const user = users[0];
      cb(null, user);
    }
  );
});

module.exports = passport;
