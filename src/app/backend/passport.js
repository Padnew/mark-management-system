const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./connection");

passport.use(
  new LocalStrategy((username, password, done) => {
    const defaultPassword = "password";
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [username],
      (err, users) => {
        if (err) {
          return done(err);
        }

        const user = users && users[0];

        if (!user) {
          console.log("User not found");
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }

        if (password === defaultPassword) {
          console.log("Password matches");
          return done(null, user);
        } else {
          console.log("Password does not match");
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
      }
    );
  })
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
