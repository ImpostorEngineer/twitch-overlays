const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: 'info' },
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: ['finitesingularity'],
});

client.connect().catch(console.error);

// Connect the client to the server..
client.on('message', async (channel, tags, message, self) => {
  if (self) return;
  if (tags['display-name'] == 'Nightbot') return;

  if (message[0] != '!') {
    cleanMessage = message.replaceAll(new RegExp('<[^>]*>', 'g'), '');
    console.log(cleanMessage);

    let chatMessage = document.createElement('div');
    let chatWindow = document.getElementById('chat');
    let chatContent =
      '<div class="wrapper"><div class="textWrapper"><div class="userName">' +
      tags['display-name'] +
      '</div><div class="message">' +
      cleanMessage +
      '</div></div><div class="userImage"><img src="./" width="70px"/></div></div>';

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
