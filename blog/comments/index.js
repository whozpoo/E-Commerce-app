const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;

  res.send(commentsByPostId[postId] || []);
});

// Give store {commentID: comment} in a list which is associated with PostID.
app.post("/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const commentId = randomBytes(4).toString("hex");

  console.log(postId);

  const comments = commentsByPostId[postId] || [];
  comments.push({
    id: commentId,
    content,
  });
  commentsByPostId[postId] = comments;

  res.status(201).send(comments);
});

app.listen(4012, () => {
  console.log("Listening on 4012");
});
