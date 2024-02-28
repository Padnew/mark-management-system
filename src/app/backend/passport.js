const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./connection");
const bcrypt = require("bcrypt");

passport.use(
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

          const user = users && users[0];
          if (!user) {
            return done(null, false, {
              message: "Incorrect username or password.",
            });
          }

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

passport.serializeUser((user, cb) => {
  cb(null, user.user_id);
});

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
