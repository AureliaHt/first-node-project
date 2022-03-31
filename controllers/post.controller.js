// imports
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

// READ
module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

// CREATE
module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// MAJ POST
module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.send(docs);
      else console.log("Update error : " + err);
    }
  );
};

// DELETE
module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("Cannot delete : " + err);
  });
};

// LIKE POST
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // ADD LIKER IDENTITY
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likers: req.body.id } },
      { new: true }
    ).then((err) => res.status(400).send(err));
    // ADD LIKE
    await UserModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } },
      { new: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(400).send(err));
  } catch (err) {
    return res.status(400).send(err);
  }
};

// UNLIKE POST
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    // REMOVE LIKER IDENTITY
    await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true }
    ).then((err) => res.status(400).send(err));
    // REMOVE LIKE
    await UserModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } },
      { new: true }
    )
      .then((docs) => res.send(docs))
      .catch((err) => res.status(400).send(err));
  } catch (err) {
    return res.status(400).send(err);
  }
};

// COMMENT A POST
module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            { $push: {
                comments: {
                    commenterId: req.body.commenterId,
                    commenterPseudo: req.body.commenterPseudo,
                    text: req.body.text,
                    timestamp: new Date().getTime()
                }
            }},
            { new: true }
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(400).send(err));
    }
    catch (err) {
        return res.status(400).send(err);
    }
};

// EDIT A COMMENT ON A POST   -     !!! ACTUALLY NOT WORKING   !!!
module.exports.editComment = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return PostModel.findById(
            req.params.id,
            (err, docs) => {
                const theComment = docs.comments.find((comment) => {
                    comment._id.equals(req.body.commentId)
                })

                if (!theComment) return res.status(404).send('Comment not found')
                theComment.text = req.body.text;

                return docs.save((err) => {
                    if (!err) return res.status(200).send(docs);
                    return res.status(500).send(err);
               })
            }
        )
    }
    catch (err) {
        return res.status(400).send(err);
    }
};

// DELETE A COMMENT ON A POST
module.exports.deleteComment = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

    try{
        return PostModel.findByIdAndUpdate(
            req.params.id,
            { $pull: {
                comments: {
                    _id: req.body.commentId,
                }
            }},
            { new: true }
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(400).send(err));
    }
    catch (err){
        return res.status(400).send(err);
    }
};