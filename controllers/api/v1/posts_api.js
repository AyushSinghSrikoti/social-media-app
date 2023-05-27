const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req, res) {
  try {
    const posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      });

    return res.json(200, {
      message: "List of posts",
      posts: posts // Use `posts` instead of `post`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports.destroy = async function(req, res) {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.user == req.user.id){
    await post.remove();

    await Comment.deleteMany({ post: req.params.id });

    return res.json(200, {
      message: "Post and associated comments deleted successfully!"
    });
    }else{
        return res.json(401,{
          message:"cant delete post"
        });
    }

  } catch (err) {
    console.log('********', err);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};
