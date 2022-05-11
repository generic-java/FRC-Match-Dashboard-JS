var hidden = true;
function showStatus() {
  var status  = document.getElementById('status');
  var fullStatus  = document.getElementById('full-status');
  var getStatus = document.getElementById('get-status');
  if(hidden) {
    status.style.top = '0%';
    fullStatus.style.display = 'block';
    getStatus.innerHTML = 'hide';
    hidden = false;
  } else {
    status.style.top = '-100%';
    fullStatus.style.display = 'none';
    getStatus.innerHTML = 'more info';
    hidden = true;
  }
}