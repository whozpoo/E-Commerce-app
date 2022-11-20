const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;

  res.send(commentsByPostId[postId] || []);
});

// Give store {commentID: comment} in a list which is associated with PostID.
app.post('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const commentId = randomBytes(4).toString('hex');

  const comments = commentsByPostId[postId] || [];
  comments.push({
    id: commentId,
    content,
    status: 'pending',
  });
  commentsByPostId[postId] = comments;

  axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: postId,
      status: 'pending',
    },
  });

  res.status(201).send(comments);
});

// aync await is used to make sure that the event is processed before the response is sent.
app.post('/events', async (req, res) => {
  console.log('Received Event:', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, content, id, status } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    console.log(data);

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data,
    });
  }

  res.send({});
});

app.listen(4012, () => {
  console.log('Listening on 4012');
});
