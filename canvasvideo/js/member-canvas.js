
function canvasInit() {
	var canvas = $('canvas')[0];
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = "rgb(200, 0, 0)";

  // タッチイベントのサポート可否を調べる
  var isTouch = ('ontouchstart' in window);
  if( isTouch ) {
    $('canvas').bind('touchmove', function() { trackingTouch(); }); 
  } else {
    $('canvas').mousemove(function(evt) {trackingMouse(evt);});    
  }
}

// タッチの軌跡を取得する
function trackingTouch() {
  $('#detectEvent').val(event.type);
  event.preventDefault();

  var rect = event.target.getBoundingClientRect();
  var x = event.changedTouches[0].clientX - rect.left;
  var y = event.changedTouches[0].clientY - rect.top;

  var frmtMsg = x + "," + y;

  if(conn == null) {
    return true;
  }

  $('#sendAxis').val(frmtMsg);
  log.i('DataChannel - send : ' + frmtMsg);
  conn.send(frmtMsg);
}

// マウスの軌跡を取得する
function trackingMouse(evt) {
  $('#detectEvent').val(evt.type);
  
  var rect = evt.target.getBoundingClientRect();
  var x = evt.clientX - rect.left;
  var y = evt.clientY - rect.top;

  var frmtMsg = x + "," + y;
  if(conn == null) {
    return true;
  }
  
  $('#sendAxis').val(frmtMsg);
  log.i('DataChannel - send : ' + frmtMsg);
  conn.send(frmtMsg);
}

window.addEventListener('load', canvasInit, false);