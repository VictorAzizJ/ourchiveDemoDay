const express = require("express");
const app = express();  // tells you the app will be in express and refers to the express files 
const mongoose = require("mongoose"); // as opposed to inteeracting with the raw MongoDB, allows you to do more
const passport = require("passport");  // for authorization 
const session = require("express-session"); 
const MongoStore = require("connect-mongo")(session); // to allow users to tay signed in even when they close the browser. Logs the session into the database
const methodOverride = require("method-override"); 
const flash = require("express-flash"); // notifications for eroors
const logger = require("morgan");
const connectDB = require("./config/database");// need all your files to configure the databade
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comment")

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport); // returns a function that you are passing a parameter into 

//Connect To Database
connectDB(); // tell the database to run 

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public")); // to serve the contents of the public folder without needing individual routes for them. 

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB -- to say that the user can get back in anytime as long as this is true 
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
