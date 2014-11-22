
function canvasInit() {
	var canvas = $('canvas')[0];
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = "rgb(200, 0, 0)";
  
  $('canvas').mousemove(function(evt) {
    var rect = evt.target.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;

    if(conn == null) {
      return true;
    }
    conn.send(x + "," + y);
    
  });
}

window.addEventListener('load', canvasInit, false);