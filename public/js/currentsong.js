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
