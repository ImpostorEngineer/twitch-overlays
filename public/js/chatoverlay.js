const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: 'info' },
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: ['impostorengineer'],
});

client.connect().catch(console.error);

function postChatMessage(username, message, tags) {
  const postOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, message, tags }),
  };
  return fetch('./api/add-post', postOptions);
}

async function countUserNames() {
  const url = './api/';
  const data = await fetch(url).then((res) => res.json());
  let userNames = [];
  let finalCountedNames = [];
  for (let i = 0; i < data.length; i++) {
    userNames.push(data[i]['username']);
  }
  userNames = [...new Set(userNames)];

  for (let u = 0; u < userNames.length; u++) {
    let count = 0;
    let userCounts = {};
    for (let i = 0; i < data.length; i++) {
      if (userNames[u] === data[i]['username']) {
        count += 1;
        let username = userNames[u];
        userCounts[username] = count;
      }
    }
    finalCountedNames.push(userCounts);
  }

  let text = '';

  for (let u = 0; u < finalCountedNames.length; u++) {
    let username = Object.keys(finalCountedNames[u]);
    text += '<li>' + username + ': ' + finalCountedNames[u][username] + '</li>';
    document.getElementById('counts').innerHTML = text;
  }
}

// Connect the client to the server..
client.on('message', async (channel, tags, message, self) => {
  if (self) return;
  if (tags['display-name'] == 'Nightbot') return;

  const username = tags['display-name'];

  // postChatMessage(username, message, tags);

  if (message[0] != '!') {
    // countUserNames();

    cleanMessage = message.replaceAll(new RegExp('<[^>]*>', 'g'), '');

    let chatMessage = document.createElement('div');
    let chatWindow = document.getElementById('chat');
    let chatContent =
      '<div class="wrapper"><div class="textWrapper"><div class="userName">' +
      username +
      '</div><div class="message">' +
      cleanMessage +
      '</div></div></div>';
    // <div class="userImage"><img src="./" width="70px"/></div></div>';

    chatMessage.innerHTML = chatContent;

    chatWindow.insertAdjacentElement('afterbegin', chatMessage);

    window.scrollTo(0, document.body.scrollHeight + 1000);

    if (message[0] == '!') {
      let messageArray = message.split(' ');
      let command = messageArray[0];
      messageArray.shift();
      let tts = messageArray.join(' ');
      if (command.toLowerCase() === '!hello') {
        let msg = new SpeechSynthesisUtterance();
        msg.text = tts;
        window.speechSynthesis.speak(msg);
        // client.say(channel, `@${tags.username}, heya!`);
      }
    }
  }
});
