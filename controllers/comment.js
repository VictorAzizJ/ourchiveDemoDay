
const comment = require("../models/Comment");
const { ObjectId } = require("mongodb");
module.exports = {

  createComment: async (req, res) => {
    console.log('info you looking for' + ' ' + req.user)
    
    try {
     comment.create({
        text: req.body.text,
        likes: 0,
        user: req.user.id,
        userName: req.user.userName,
        commentFor: req.params.id,
        feedback: req.body.feedback,
        simProjects: req.body.simProjects,

      });
      console.log("Post has been added!");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  likeComment: async (req, res) => {
    try {
      await comment.findOneAndUpdate(
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
  deleteComment: async (req, res) => {
    console.log(req.params)
    try {
      
      
      //let test = await comment.findByID(ObjectId(req.params.id));
      //console.log('testing' , test)
      
      await comment.remove({ _id: ObjectId(req.params.id) });
      console.log("Deleted Comment");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/error");
    }
  },
};