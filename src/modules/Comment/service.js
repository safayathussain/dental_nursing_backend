const { default: mongoose } = require("mongoose");
const Comment = require("./model");
const Question = require("../Question/model");
const createComment = async (commentData) => {
  try {
    if (commentData?.rootCommentId) {
      await Comment.findByIdAndUpdate(commentData?.rootCommentId, {
        $inc: { childrensCount: 1 },
      });
    }
    const newComment = new Comment(commentData);
    await newComment.save();
    if (commentData.postType === "Question") {
      await Question.findByIdAndUpdate(commentData?.postId, {
        $inc: { commentsCount: 1 },
      });
    }
    return {
      data: await newComment.populate("userId", "name profilePicture"),
      message: "Comment added",
      statusCode: 201,
      success: true,
    };
  } catch (err) {
    return {
      data: null,
      message: "Failed to add comment",
      statusCode: 500,
      success: false,
    };
  }
};

const getRepliesOfComment = async (rootCommentId) => {
  function buildCommentTree(comments, rootId = null) {
    const map = new Map();
    comments.forEach((comment) => {
      map.set(comment._id.toString(), { ...comment, children: [] });
    });
    const tree = [];
    comments.forEach((comment) => {
      const currentComment = map.get(comment._id.toString());
      if (comment.parentId && comment.parentId.toString() !== rootId) {
        const parentComment = map.get(comment.parentId.toString());
        if (parentComment) {
          parentComment.children.push(currentComment);
        }
      } else {
        tree.push(currentComment);
      }
    });
    return tree;
  }
  const allComments = await Comment.find({ rootCommentId })
    .populate("userId", "name profilePicture")
    .lean();
  const tree = buildCommentTree(allComments, rootCommentId);
  return { data: tree };
};
const likeComment = async (req, id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Comment not found", success: false };
  }
  const comment = await Comment.findByIdAndUpdate(id, {
    $addToSet: { likedUser: req._id },
  });
  if (!comment) {
    return {
      statusCode: 404,
      message: "Comment not found",
      success: false,
    };
  }
  return {
    data: comment,
    message: "Comment liked",
  };
};
const dislikeComment = async (req, id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return { statusCode: 404, message: "Comment not found", success: false };
  }
  const comment = await Comment.findByIdAndUpdate(id, {
    $pull: { likedUser: req._id },
  });
  if (!comment) {
    return {
      statusCode: 404,
      message: "Comment not found",
      success: false,
    };
  }
  return {
    data: comment,
    message: "Comment disliked",
  };
};
module.exports = {
  createComment,
  getRepliesOfComment,
  likeComment,
  dislikeComment,
};
