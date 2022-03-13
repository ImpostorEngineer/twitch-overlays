const express = require('express');
const router = express.Router();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const client = new MongoClient(process.env.MONGO_URI);

async function findChat() {
  try {
    await client.connect();
    const database = client.db('twitch_chat');
    const chatLog = database.collection('twitch_chat');
    const result = await chatLog.find();
    let response = [];
    await result.forEach((res) => {
      response.push(res);
    });
    return response;
  } finally {
    await client.close();
  }
}

async function recordChat(username, message, tags) {
  try {
    await client.connect();
    const database = client.db('twitch_chat');
    const chatLog = database.collection('twitch_chat');
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
  const result = await findChat();
  res.json(result);
});

router.post('/add-post', async (req, res, next) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const data = JSON.parse(body);
    const username = data['username'];
    const message = data['message'];
    const tags = data['tags'];
    recordChat(username, message, tags);
    res.end('ok');
  });
  next();
});

module.exports = router;
