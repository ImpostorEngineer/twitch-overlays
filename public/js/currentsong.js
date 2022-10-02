function getData() {
  return fetch('http://localhost:1608/').then((res) => res.json());
}

async function innerHTML() {
  const res = await getData();
  if (res['status'] == 'playing') {
    let innerHTML = `${res['artists'][0].toUpperCase()} - ${res['title'].toUpperCase()}`;
    document.getElementById('current-song').innerHTML = innerHTML;
  }
}

async function chatClient() {
  const currentSong = await getData();
  let songInfo = 'Henuz birsey calmiyor';
  if (currentSong['status'] == 'playing') {
    songInfo = `${currentSong['artists'][0].toUpperCase()} - ${currentSong['title'].toUpperCase()}`;
  }
  const access_token = process.env.TWITCH_ACCESS_TOKEN;
  const password = 'oauth:' + access_token;
  console.log(password);
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

  client.on('message', (channel, badges, message, self, tags) => {
    // Ignore echoed messages.
    console.log(message);
    if (message.toLowerCase() === '!song') {
      // "@alca, heya!"
      client.say(channel, songInfo);
    }
  });
}

chatClient();
