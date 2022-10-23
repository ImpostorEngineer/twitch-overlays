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

    const fullMessage = message.toLowerCase().split(' ');
    const command = fullMessage[0];
    const remove = fullMessage.shift();
    const text = fullMessage.join(' ');

    if (command === '!sarki' || command === '!song' || command === '!currentsong') {
      const songInfo = await getSongName();
      client.say(channel, songInfo);
    }
    if ((command === '!house' || command === '!housed') && userLevel) {
      readIt('house');
    }
    if (command === '!bs' && userLevel) {
      readIt('black smith');
    }
    if ((command === '!up' || command === '!up') && userLevel) {
      readIt('age up');
    }
    if ((command === '!vill' || command === '!vil') && userLevel) {
      readIt('villager');
    }
    if (command == '!ekran' && userLevel) {
      readIt('ekran');
    }
    if (command == '!market' && userLevel) {
      readIt('market');
    }
    if ((command == '!read' || command == '!oku') && userLevel) {
      readIt(text);
    }
    if ((command == '!test' || command == '!test') && userLevel) {
      let voice1 = window.speechSynthesis.getVoices();
      let voice2 = voice1[2];
      let vname = `This is it: ${voice1}`;

      // const now = new Date();
      // const date = `It is ${now.toTimeString()} - ${now.toDateString()}`;
      console.log(vname);
      client.say(channel, 'vname');
    }
  });
}

chatClient();
