const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const axios = require("axios");
const assembly = axios.create({
  baseURL: "https://api.assemblyai.com/v2",
  headers: {
    authorization: "79307c56c393425082c1ef652b1ec11d",
    "content-type": "application/json",
  },
});
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  }, 
  // get from the user for search look at line 19 create search form refer to line 25 for simalar 

  /*getSearch: async (req, res) => {
    try {
      const posts = await Post.find(`${}`).sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  }, */
  getPost: async (req, res) => {
    try {
       
      const post = await Post.findById(req.params.id);
      const comment = await Comment.find({commentFor: req.params.id})
       console.log(post)
       console.log(comment)
      res.render("post.ejs", { post: post, user: req.user, comment: comment });
    } catch (err) {
      console.log(err);
    }
  },

  /*getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comment = res.render("post.ejs", {
        post: post,
        user: req.user,
        comment: comment,
      });
    } catch (err) {
      console.log(err);
    }
  },*/  
  createPost: async (req, res) => {
    try {
      console.log(req.file);
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      }); 
      console.log(result);
      const postresult = await assembly.post("/transcript", {
        audio_url: result.secure_url,
      });

      console.log(postresult.data);
      if (req.body.fileType !== "image"){
      while (true) {
        await sleep(1000);
        const transcription = await assembly.get(
          `/transcript/${postresult.data.id}`
          );
          console.log(transcription.data);
        if (transcription.data.status == "completed") {
          await Post.create({
            title: req.body.title,
            image: result.secure_url,
            cloudinaryId: result.public_id,
            caption: req.body.caption,
            likes: 0,
            fileType: req.body.fileType,
            user: req.user.id,
            text: transcription.data.text,
            words: transcription.data.words
          });  
          console.log("Post has been added!");
           res.redirect("/profile");
           return
        }
      }
    } else{
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        fileType: req.body.fileType,
        user: req.user.id,
        text: "",
        words: ""
      });  
      
        res.redirect("/profile");
        return

    }
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
