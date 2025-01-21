const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const access_token = urlParams.get('token');
const channel = urlParams.get('channel');

const damage = new Audio('../audio/assets_audio_clips_emotional_damage.mp3');
damage.volume = 0.03;
const applause = new Audio('../audio/assets_audio_clips_applause.mp3');
applause.volume = 0.03;
const drum = new Audio('../audio/assets_audio_clips_drumroll.mp3');
drum.volume = 0.03;
const hail = new Audio('../audio/assets_audio_clips_hailed.mp3');
hail.volume = 0.03;
const gotTime = new Audio('../audio/assets_audio_clips_nobody.mp3');
gotTime.volume = 0.03;
const rimshot = new Audio('../audio/assets_audio_clips_rimshot.mp3');
rimshot.volume = 0.03;
const sadTrombone = new Audio('../audio/assets_audio_clips_sadtrombone.mp3');
sadTrombone.volume = 0.03;
const shame = new Audio('../audio/assets_audio_clips_shame.mp3');
shame.volume = 0.03;
const wrong = new Audio('../audio/assets_audio_clips_wrong.mp3');
wrong.volume = 0.03;

function readIt(it) {
  let voice = window.speechSynthesis.getVoices();
  let speech = new SpeechSynthesisUtterance();
  speech.voice = voice[2];
  speech.lang = 'en';
  speech.text = it;
  speech.volume = 0.7;
  window.speechSynthesis.speak(speech);
}

async function getSongName() {
  let songInfo = 'Henuz birsey calmiyor';
  try {
    const currentSong = await getData();
    if (currentSong['status'] == 'playing') {
      songInfo = `${currentSong['artists'][0]} - ${currentSong['title']}`;
    }
  } catch (error) {
    songInfo = 'Henuz birsey calmiyor';
  }
  return songInfo;
}

async function chatClient() {
  const password = 'oauth:' + access_token;
  const options = {
    debug: true,
    messagesLogLevel: 'info',
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channel],
  };

  if (access_token) {
    options.identity = {
      username: 'ImpostorEngBot',
      password: password,
    };
  }
  const client = new tmi.Client({ ...options });

  client.connect();

  client.on('message', async (channel, badges, message, self, tags) => {
    let userLevel = false;
    if (badges['badges'] !== null) {
      userLevel = badges['badges']['moderator'] == 1 || badges['badges']['broadcaster'] == 1;
    } else {
      userLevel = badges['user-id'] == '489870215';
    }

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
    if (command == '!test' && userLevel) {
      readIt(text);
    }

    // if (command == '!damage' && userLevel) {
    //   damage.play();
    // }
    // if ((command == '!alkis' || command == '!clap') && userLevel) {
    //   applause.play();
    // }
    // if (command == '!drum' && userLevel) {
    //   drum.play();
    // }
    // if (command == '!hail' && userLevel) {
    //   hail.play();
    // }
    // if (command == '!time' && userLevel) {
    //   gotTime.play();
    // }
    // if (command == '!tis' && userLevel) {
    //   rimshot.play();
    // }
    // if (command == '!sad' && userLevel) {
    //   sadTrombone.play();
    // }
    // if (command == '!shame' && userLevel) {
    //   shame.play();
    // }
    // if (command == '!wrong' && userLevel) {
    //   wrong.play();
    // }

    if (command == '!test' && userLevel) {
      readIt(text);

      // new Audio('../audio/assets_audio_clips_emotional_damage.mp3').play();
      // let voice1 = window.speechSynthesis.getVoices();
      // let voice2 = voice1[2];
      // let vname = `This is it: ${voice1}`;
      // // const now = new Date();
      // // const date = `It is ${now.toTimeString()} - ${now.toDateString()}`;
      // console.log(vname);
      // client.say(channel, 'vname');
    }
  });
}

chatClient();
