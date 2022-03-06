const urlParams = new URLSearchParams(window.location.search);
let startTime = urlParams.get('time') * 60;

let counting = setInterval(function () {
  if (startTime >= 0) {
    let secs = (Math.floor(startTime) % 60).toString().padStart(2, '0');
    let mins = (Math.floor(startTime / 60) % 60).toString().padStart(2, '0');
    let hours = (Math.floor(startTime / 60 / 60) % 24).toString().padStart(2, '0');
    let days = Math.floor((startTime / 60 / 60 / 24) % 24)
      .toString()
      .padStart(2, '0');
    let daysText = `${days} days ${hours}:${mins}:${secs}`;
    let hoursText = `${hours}:${mins}:${secs}`;
    let minsText = `${mins}:${secs}`;
    const countDownText = days > 0 ? daysText : hours > 0 ? hoursText : minsText;

    document.getElementById('countup').innerHTML = countDownText;

    startTime += 1;
  }
  if (startTime < 0) {
    clearInterval(counting);
  }
}, 1000);
