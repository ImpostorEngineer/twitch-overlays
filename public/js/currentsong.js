const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const access_token = urlParams.get('token');
const channel = urlParams.get('channel');

function getData() {
  return fetch('http://localhost:1608/').then((res) => res.json());
}

async function innerHTML() {
  const res = await getData();
  if (res['status'] == 'playing') {
    let innerHTML = `${res['artists'][0].toUpperCase()} - ${res['title'].toUpperCase()}`;
    let size = innerHTML.length;
    let width = size * 60;
    console.log(width);
    document.getElementById('song-wrapper').style.width = width + 'px';
    document.getElementById('current-song').innerHTML = innerHTML;
  }
}

async function getSongName() {
  const currentSong = await getData();
  let songInfo = 'Henuz birsey calmiyor';
  if (currentSong['status'] == 'playing') {
    songInfo = `${currentSong['artists'][0]} - ${currentSong['title']}`;
  }
  return songInfo;
}

async function chatClient() {
  const password = 'oauth:' + access_token;
  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: 'ImpostorEngBot',
      password: password,
    },
    channels: [channel],
  });

  client.connect();

  client.on('message', async (channel, badges, message, self, tags) => {
    if (
      message.toLowerCase() === '!sarki' ||
      message.toLowerCase() === '!song' ||
      message.toLowerCase() === '!currentsong'
    ) {
      const songInfo = await getSongName();
      client.say(channel, songInfo);
    }
  });
}

chatClient();
