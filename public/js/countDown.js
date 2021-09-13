const urlParams = new URLSearchParams(window.location.search);
let timeLeft = urlParams.get('time') * 60;

let counting = setInterval(function () {
  if (timeLeft >= 0) {
    let secs = (Math.floor(timeLeft) % 60).toString().padStart(2, '0');
    let mins = (Math.floor(timeLeft / 60) % 60).toString().padStart(2, '0');
    let hours = (Math.floor(timeLeft / 60 / 60) % 24).toString().padStart(2, '0');
    let days = Math.floor((timeLeft / 60 / 60 / 24) % 24)
      .toString()
      .padStart(2, '0');
    let daysText = `${days} days ${hours}:${mins}:${secs}`;
    let hoursText = `${hours}:${mins}:${secs}`;
    let minsText = `${mins}:${secs}`;
    const countDownText = days > 0 ? daysText : hours > 0 ? hoursText : minsText;

    document.getElementById('countdown').innerHTML = countDownText;

    if (timeLeft < 10) {
      document.getElementById('countdown').classList.add('red');
      document.getElementById('countdown').classList.add('blink');
    }
    timeLeft -= 1;
  }
  if (timeLeft < 0) {
    clearInterval(counting);
  }
}, 1000);
