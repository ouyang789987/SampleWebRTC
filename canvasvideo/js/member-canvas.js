
function canvasInit() {
	var canvas = $('canvas')[0];
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = "rgb(200, 0, 0)";
  
  $('canvas').mousemove(function(evt) {
    trackingMouse(evt);
  });

  $('canvas').touchmove(function(evt) {
    trackingMouse(evt);
  });

}

function trackingMouse(evt) {
  $('#detectEvent').val(evt.type);
  
  var rect = evt.target.getBoundingClientRect();
  var x = evt.clientX - rect.left;
  var y = evt.clientY - rect.top;

  if(conn == null) {
    return true;
  }
  var frmtMsg = x + "," + y;
  $('#sendAxis').val(frmtMsg);
  conn.send(frmtMsg);
}

window.addEventListener('load', canvasInit, false);