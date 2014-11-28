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

  var axes = null;
  var axis = new Array(AXIS_ARRAY_LENGTH);
  var x_px = 0, y_px = 0;

  ws.onmessage = function(elm) {
    axes = elm.data;
    axis = elm.data.split(',');
    x_px = axis[0];
    y_px = axis[1];

    conn.send(axes);
    canvasDrawAxis(x_px, y_px);
  };
}

// 受信した座標を描画する

function canvasDrawAxis(x_px, y_px) {

  ctx.clearRect(0, 0, VGA_WIDTH_PX, VGA_HEIGHT_PX);
  ctx.strokeRect(x_px - MARKER_SIZE_Y/2,
                         y_px - MARKER_SIZE_Y/2,
                         MARKER_SIZE_X, MARKER_SIZE_Y);
}

var canvas, ctx = null;
function getUIElements() {
  canvas = $('canvas')[0];
  ctx = canvas.getContext('2d');
  ctx.lineWidth = MARKER_WIDTH;
  ctx.strokeStyle = "rgb(204, 0, 0)";

}
//window.addEventListener('load', websocketInit, false);
$(document).ready(function() {
  getUIElements();
  websocketInit();
});
