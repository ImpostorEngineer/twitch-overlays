const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: 'info' },
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: ['impostorengineer'],
});

client.connect().catch(console.error);

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
        userCounts['username'] = username;
        userCounts['count'] = count;
      }
    }
    finalCountedNames.push(userCounts);
  }

  finalCountedNames.sort((a, b) => b.count - a.count);

  let text = '';

  for (let u = 0; u < finalCountedNames.length; u++) {
    const username = finalCountedNames[u]['username'];
    const count = finalCountedNames[u]['count'];
    if (count > 10) {
      text += '<li>' + username + ': ' + count + '</li>';
    }
    document.getElementById('counts').innerHTML = text;
  }
}

client.on('message', async (channel, tags, message, self) => {
  countUserNames();
});
countUserNames();
