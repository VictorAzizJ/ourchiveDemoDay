const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  
  text:{
    type: String,
    required: true
  },
  feedback:{
    type: String,
    required: true
  },
  simProjects:{
    type: String,
    required: true
  },
  
  commentFor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: "User",

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comment", CommentSchema);
