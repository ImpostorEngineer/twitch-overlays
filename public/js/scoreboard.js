let options = {
  options: {
    debug: true,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: ['#deradlerskartal'],
};
let client = new tmi.client(options);
// Connect the client to the server..
client.connect();
let myscore = +localStorage.getItem('myscore');
let opponentscore = +localStorage.getItem('opponentscore');
document.getElementById('opponentscore').innerHTML = opponentscore;
document.getElementById('myscore').innerHTML = myscore;

client.on('message', (channel, tags, message, self) => {
  let command = message.split(' ');
  if (command[0] == '!win' && tags.badges.moderator != null) {
    myscore += 1;
    localStorage.setItem('myscore', myscore);
    document.getElementById('myscore').innerHTML = myscore;
  }
  if (command[0] == '!lose' && tags.badges.moderator != null) {
    opponentscore += 1;
    localStorage.setItem('opponentscore', opponentscore);
    document.getElementById('opponentscore').innerHTML = opponentscore;
  }
  if (command[0] == '!resetscore' && tags.badges.moderator != null) {
    myscore = 0;
    opponentscore = 0;
    localStorage.setItem('myscore', myscore);
    localStorage.setItem('opponentscore', opponentscore);
    document.getElementById('myscore').innerHTML = myscore;
    document.getElementById('opponentscore').innerHTML = opponentscore;
  }
});
