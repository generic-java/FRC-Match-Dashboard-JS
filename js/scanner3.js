var teamID = 6936;
var eventID = '2022alhu'; //should be changed to the most current event
var matchTimestamps = [];
var matchNumbers = [];
var allianceColor = "blue";
var currentMatchNum = 0;
var data = null;
var fetchTimestamp = new Date();
var fetchData = true;
var fetchInterval = 30;
var timesFetched = 0;
var color = '#3470d1';
var number_wrapper = document.getElementById('number-wrapper');
window.setInterval(function() { //using setInterval with a 0 second interval is basically a way to have an indefinitely long loop without breaking javascript
function twoChars(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
}
function twelveHour(num) {
  if (num > 12) {
    return num-12;
  } else {
    return num;
  }
}
function AMPM(hours) {
  if (hours > 11) {
    return "PM";
  } else {
    return "AM";
  }
}
function timeTo(milliseconds) {
  var daysLeft = Math.floor(milliseconds/(1000*60*60*24));
  var remainder = milliseconds % (1000*60*60*24);
  var hoursLeft = Math.floor(remainder/(1000*60*60));
  var remainder = remainder % (1000*60*60);
  var minsLeft = Math.floor(remainder/(1000*60));
  var remainder = remainder % (1000*60);
  var secondsLeft = Math.floor(remainder/1000);
  return [daysLeft, hoursLeft, minsLeft, secondsLeft];
}
function notZero(num, caption) {
  if(num != 0) {
    return num + " " + caption + " ";
  } else {
    return num;
  }
}
function readableTimeTo(timeLeft) {
  var caption = notZero(timeLeft[0], "days");
  var caption = caption + notZero(timeLeft[1], "h");
  var caption = caption + notZero(timeLeft[2], "m");
  var caption = caption + timeLeft[3] + " s";
  return caption;
}
function readable(timestamp) { 
  const date = new Date(timestamp * 1000);
  return twelveHour(date.getHours()) + ":" + twoChars(date.getMinutes()) + " " + AMPM(date.getHours());
}
var i = 0;
var now = new Date();
if(now.getTime() - fetchTimestamp.getTime() > fetchInterval * 1000) { //updates every 30s or 30,000 milliseconds
  fetchTimestamp = new Date();
  fetchData = true;
}
var displayTime = twelveHour(now.getHours()) + ":" + twoChars(now.getMinutes()) + ":" + twoChars(now.getSeconds())
displayTime = displayTime + " " + AMPM(now.getHours());
$("#countdown").html(displayTime); 
currentMatch = new Date(matchTimestamps[currentMatchNum] * 1000);
timeLeft = readableTimeTo(timeTo(currentMatch.getTime()-now.getTime()));
$("#remaining_time").html(timeLeft); 
if(currentMatch.getTime()-now.getTime() < 300000 && currentMatch.getTime()-now.getTime() > -10000) {
  $("#remaining_time").css('color', 'yellow');
} else {
  $("#remaining_time").css('color', color);
}
function laterThan(timestamp) {
  const date = new Date(timestamp * 1000);
  return (date.getTime() > now.getTime());
}
function isNextMatch(data) {
  return (currentMatchNum+1 != data.length);
}
function logData(data) {
  this.data = data;
  currentMatchNum = null; //Must be reset to null or else it won't find the latest match
  matchTimestamps = []; //Also must be reset
  for (i = 0; i < data.length; i++) {
    matchTimestamps.push(data[i].predicted_time);
    if (currentMatchNum == null && laterThan(matchTimestamps[i])) {
      currentMatchNum = i;
    }
  }
  if (currentMatchNum == null) { //for testing purposes
    currentMatchNum = 1;
  } 
  color = null;
  for (i = 0; i < 3; i++) {
    if (data[currentMatchNum].alliances.blue.team_keys[i] == 'frc' + teamID) { 
      color = '#3470d1';
    }
  }
  if (color == null) {
    color = '#d62e2e';
  }
  console.log(data);  
  if (timesFetched == 1) {
    for (i = 0; i < data.length; i++) {
      var div = document.createElement('div');
      div.id = 'div' + i;
      div.class = 'number-box';
      div.setAttribute('style', 'background-color: white');
      number_wrapper.appendChild(div);
      var p = document.createElement('div');
      p.id = 'p' + i;
      p.class = 'current_number';
      div.appendChild(p);
    }
  }
  for (i = 0; i < data.length; i++) {
    $('#p'+i).html(data[i].match_number)
  }
  if (true || laterThan(matchTimestamps[currentMatchNum]) && matchTimestamps[currentMatchNum] != null) { //checking whether there is still a match in the future and if there is data available on it
    $("#current_match").html(readable(matchTimestamps[currentMatchNum]));
    $("#match-wrapper").css('display', 'block');
    $("#remaining-time-wrapper").css('width', 'auto');
    $("#next-match").html("next match in");
    $("#countdown-wrapper").css('left', '0');
    $("#countdown-wrapper").css('transform', 'translateX(0)');
    if (currentMatchNum != null) {
      $("#current_number").html(data[currentMatchNum].match_number); 
    } 
    if(data[currentMatchNum].actual_time == null) {
	var actualTime = "unknown";
    } else {
      var actualTime = new Date(data[currentMatchNum].actual_time*1000);
    }
    var currentMatch = new Date(data[currentMatchNum].predicted_time*1000);
    $('#json').html('times fetched: ' + timesFetched + '<br>' + 'fetching data from api every ' + fetchInterval + 's' + '<br>' + 'total matches: ' + data.length + '<br>' + 'actual time of current match: ' + actualTime + '<br>' + 'predicted time: ' + currentMatch + '<br>' + 'best of luck :)');
    $("#body").css('background-color', color);
    $("#countdown").css('color', color);
    $("#current_match").css('color', color);
    $("#current_number").css('color', color);
    $("#remaining_time").css('color', color);
    $("#get-status").css('color', color);
    $("#status").css('background-color', color);
  } else {
    $("#countdown-wrapper").css('left', '50%');
    $("#countdown-wrapper").css('transform', 'translateX(-50%)');
    $("#match-wrapper").css('display', 'none');
    $("#remaining_time").css('display', 'none');
    $("#remaining-time-wrapper").css('width', '100%'); 
    if(matchTimestamps[currentMatchNum] != null || currentMatchNum == null && data[0].predicted_time != null) { //if that value equals null then TBA doesn't have the necessary data yet
      $("#next-match").html("Looks like you're all done with matches!");
      $("#json").html('total matches: ' + data.length + '<br>' + 'no upcoming matches!');
    } else {
      $("#next-match").html("Currently, TBA has no info on upcoming matches.  Try again later!");
      $("#json").html("Well...The Blue Alliance doesn't seem to have any information on this tournament at the moment, which probably means the event has not begun yet.  Check back another time!");
    }   
  } 
}
const URL = 'https://www.thebluealliance.com/api/v3/team/frc' + teamID + '/event/' + eventID + '/' + 'matches';
var key = 'GAHGTZ290bRxHnbX13UurGfvEgyUaHukRxK2ktrMg2XCNyvykH1IibGqasL3al9I';
// Send a get request
if (fetchData == true) {
  timesFetched++;
  fetch(URL, {
         method: "GET",
         headers: { 'X-TBA-Auth-Key': key }
      }).then(response => response.json()).then(logData);
  fetchData = false;
}
})




