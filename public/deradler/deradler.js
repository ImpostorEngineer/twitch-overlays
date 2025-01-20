function getCurrentURL() {
  return window.location.href;
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
  const url = getCurrentURL();
  let access_token = '';
  if (url.split('#').length > 1) {
    access_token = url.split('#')[1].split('=')[1].split('&')[0];
    console.log(access_token);
  } else {
    console.log('REDIRECT');
    window.addEventListener('load', (event) => {
      location.replace(
        'https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=rd9v5deacyccre7grn7cgqc84rigch&redirect_uri=http://localhost:8080&scope=chat%3Aedit+chat%3Aread&state=c3ab8aa609ea11e793ae92361f002671'
      );
    });
  }

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
    channels: ['deradlerskartal'],
  });

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
    if (command == '!imp' && userLevel) {
      client.say(channel, 'go imp!');
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
