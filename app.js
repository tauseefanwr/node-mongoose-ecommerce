const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODBURI =
  "mongodb+srv://tauseefanwar:tauseefdb!23@cluster0.mcg9n.mongodb.net/shop";
const app = express();
const store = new MongoDBStore({
  uri: MONGODBURI,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secrecyismaintaiends",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
/* This initiates the csrfProtection */
app.use(csrfProtection);

app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});
/* These type of middleware makes sure that the data available in this scope will be available on all request */
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(6868);
  })
  .catch((err) => {
    console.log(err);
  });
