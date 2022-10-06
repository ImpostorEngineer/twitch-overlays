const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const querystring = require('node:querystring');

async function findChat(collection) {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const database = client.db('twitch_chat');
    const chatLog = database.collection(collection);
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

// async function findSong(song) {
//   const encoded = encodeURI(song);
//   const spotifyURL = 'https://api.spotify.com/v1/search';
//   const config = {
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${process.env.SPOTIFY_OATH}`,
//     },
//   };

//   const data = await axios.get(spotifyURL, config, {
//     data: {
//       type: 'track',
//       limit: 1,
//       q: encoded,
//     },
//   });
//   console.log(spotifyURL);
//   return data;
// }

// router.get('/login', function (req, res) {
//   // const state = generateRandomString(16);
//   const scope = 'user-read-private user-read-email user-read-currently-playing';
//   const redirect_uri = 'http://localhost:5000/api/callback/';
//   const client_id = process.env.SPOTIFY_CLIENT_ID;
//   console.log('hello login');

//   res.redirect(
//     'https://accounts.spotify.com/authorize?' +
//       querystring.stringify({
//         response_type: 'code',
//         client_id: client_id,
//         scope: scope,
//         redirect_uri: redirect_uri,
//         // state: state,
//       })
//   );
// });

// router.get('/callback', function (req, res) {
//   var code = req.query.code || null;
//   var state = req.query.state || null;
//   const redirect_uri = 'http://localhost:5000/api/callback/';
//   const client_id = process.env.SPOTIFY_CLIENT_ID;
//   const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
//   console.log('hello callback', code);

//   const authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     form: {
//       code: code,
//       redirect_uri: redirect_uri,
//       grant_type: 'authorization_code',
//     },
//     headers: {
//       Authorization: 'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64'),
//     },
//     json: true,
//   };

//   const auth = axios
//     .get(authOptions['url'], authOptions)
//     .then((res) => res.json())
//     .then((res) => console.log(res));
// });

// router.get('/song/:song', async (req, res, next) => {
//   const song = req.params.song;
//   const result = await findSong(song);
//   // .catch(console.dir);
//   res.json(result);
// });

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
