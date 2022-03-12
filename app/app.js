const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);

async function findChat() {
  try {
    await client.connect();
    const database = client.db('twitch_chat');
    const chatLog = database.collection('twitch_chat');
    const result = await chatLog.find();
  } finally {
    await client.close();
  }
}

async function recordChat(tags, message) {
  try {
    await client.connect();
    const database = client.db('twitch_chat');
    const chatLog = database.collection('twitch_chat');
    const doc = {
      username: tags['username'],
      message,
      tags,
    };
    const result = await chatLog.insertOne(doc);
  } finally {
    await client.close();
  }
}

router.get('/', async (req, res, next) => {
  res.json({ hello: 'world' });
  // const result = await findChat();
  // res.json(result);
});

router.post('/add-post', async (req, res, next) => {
  recordChat(req.tags, req.message);
  next();
});

module.exports = router;
