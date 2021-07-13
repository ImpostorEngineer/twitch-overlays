let options = {
  options: {
    debug: true,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  // identity: {
  //   username: 'Schmoopiie',
  //   password: 'oauth:a29b68aede41e25179a66c5978b21437',
  // },
  channels: ['#deradlerskartal'],
};
let client = new tmi.client(options);
// Connect the client to the server..
client.connect();
let myscore = 0;
let opponentscore = 0;
client.on('message', (channel, tags, message, self) => {
  let command = message.split(' ');
  if (command[0] == '!win' && tags.badges.moderator != null) {
    myscore += 1;
    document.getElementById('myscore').innerHTML = myscore;
  }
  if (command[0] == '!lose' && tags.badges.moderator != null) {
    opponentscore += 1;
    document.getElementById('opponentscore').innerHTML = opponentscore;
  }
  if (command[0] == '!resetscore' && tags.badges.moderator != null) {
    myscore = 0;
    opponentscore = 0;
    document.getElementById('myscore').innerHTML = myscore;
    document.getElementById('opponentscore').innerHTML = opponentscore;
  }
});
