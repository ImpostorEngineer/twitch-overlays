const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function findChat(collection) {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const database = client.db('twitch_chat');
    const chatLog = database.collection();
    const result = chatLog.find();
    let response = [];
    await result.forEach((res) => {
      response.push(res);
    });
    return response;
  } finally {
    await client.close();
  }
}

async function recordChat(username, message, tags, collection) {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const database = client.db('twitch_chat');
    const chatLog = database.collection(collection);
    const doc = {
      username,
      message,
      tags,
    };
    const result = await chatLog.insertOne(doc);
  } finally {
    await client.close();
  }
}

router.get('/', async (req, res, next) => {
  const result = await findChat('twitch_chat').catch(console.dir);
  res.json(result);
});

router.get('/medallion', async (req, res, next) => {
  const result = await findChat('twitch_chat_medallion').catch(console.dir);
  res.json(result);
});

router.post('/add-post/self', async (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    const username = data['username'];
    const message = data['message'];
    const tags = data['tags'];
    recordChat(username, message, tags, 'twitch_chat').catch(console.dir);
    res.end('ok');
  });
  next();
});

router.post('/add-post/medallion', async (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    const username = data['username'];
    const message = data['message'];
    const tags = data['tags'];
    recordChat(username, message, tags, 'twitch_chat_medallion').catch(console.dir);
    res.end('ok');
  });
  next();
});

module.exports = router;
