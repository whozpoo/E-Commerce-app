const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const { type } = require('os');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts/create', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: posts[id],
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received Event:', req.body.type);

  const { type, data } = req.body;

  res.send({});
});

app.listen(4011, () => {
  console.log('Listening on 4011.');
});
