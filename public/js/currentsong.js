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

function readIt(it) {
  let voice = window.speechSynthesis.getVoices();
  let speech = new SpeechSynthesisUtterance();
  speech.voice = voice[2];
  speech.lang = 'en';
  speech.text = it;
  speech.volume = 0.7;
  window.speechSynthesis.speak(speech);
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
    const userLevel =
      badges['badges']['moderator'] || badges['badges']['broadcaster'] || badges['user-id'] == '489870215';

    if (
      message.toLowerCase() === '!sarki' ||
      message.toLowerCase() === '!song' ||
      message.toLowerCase() === '!currentsong'
    ) {
      const songInfo = await getSongName();
      client.say(channel, songInfo);
    }
    if ((message.toLowerCase() === '!house' || message.toLowerCase() === '!housed') && userLevel) {
      readIt('house');
    }
    if (message.toLowerCase() === '!bs' && userLevel) {
      readIt('black smith');
    }
    if ((message.toLowerCase() === '!up' || message.toLowerCase() === '!up') && userLevel) {
      readIt('age up');
    }
    if ((message.toLowerCase() === '!vill' || message.toLowerCase() === '!vil') && userLevel) {
      readIt('villager');
    }
    if (message.toLowerCase() == '!ekran' && userLevel) {
      readIt('ekran');
    }
    if (message.toLowerCase() == '!market' && userLevel) {
      readIt('market');
    }
    if (
      (message.toLowerCase().split(' ')[0] == '!read' || message.toLowerCase().split(' ')[0] == '!oku') &&
      userLevel
    ) {
      const m = message.toLowerCase().split(' ');
      const remove = m.shift();
      const text = m.join(' ');
      readIt(text);
      let voice = window.speechSynthesis.getVoices();
      client.say(channel, voice[2].voiceURI, voice[3].voiceURI, voice[4].voiceURI, voice[5].voiceURI);
    }
  });
}

chatClient();
