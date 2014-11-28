//WebSocket connect

var ws;
// HTTPサーバと同一IP
var wsURL = "ws://" + window.location.hostname + ":" + WS_PORT + "/" + PREFIX;
log.i(wsURL);

function websocketInit() {
	ws = new WebSocket(wsURL);
	ws.binaryType = 'blob';

	ws.onopen = function() {
		log.i('Open WebSocket conection');
	};

	ws.onmessage = function(elm) {
    var axis = elm.data;
    conn.send(axis);
	};
}

function canvasInit() {
	var canvas = $('canvas')[0];
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = "rgb(200, 0, 0)";
  
  $('canvas').mousemove(function(evt) {
    var rect = evt.target.getBoundingClientRect() ;
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    log.i(x + " " + y);
    ctx.clearRect(0, 0, VGA_WIDTH_PX, VGA_HEIGHT_PX);
    ctx.strokeRect(x, y, 20, 20);
  });


}

window.addEventListener('load', websocketInit, false);
// window.addEventListener('load', canvasInit, false);
