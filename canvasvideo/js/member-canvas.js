var rect = null;
var x, y = 0;
var frmtMsg ="";
var lastTime = null;
function canvasInit() {
  var canvas = $('canvas')[0];
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = "rgb(200, 0, 0)";

  console.log("   "+getDevice);

  if( getDevice === "other") {
    console.log(" Device : PC!");
    $('canvas').mousemove(function(evt){ trackingMouse(evt);} );
  } else {
    console.log(" Device : Mobile!!");
    $('canvas').bind('touchmove', function() { trackingTouch(); }); 
  }
}

// タッチの軌跡を取得する
function trackingTouch() {
  $('#detectEvent').val(event.type);
  event.preventDefault();

  rect = event.target.getBoundingClientRect();
  x = event.changedTouches[0].clientX - rect.left;
  y = event.changedTouches[0].clientY - rect.top;

  frmtMsg = x + "," + y;

  // console.log(frmtMsg);
  if(conn === null) {
    return true;
  }

  $('#sendAxis').val(frmtMsg);
  log.i('DataChannel - send : ' + frmtMsg);
  conn.send(frmtMsg);
}

// マウスの軌跡を取得する
function trackingMouse(evt) {
  $('#detectEvent').val(evt.type);
  
  rect = evt.target.getBoundingClientRect();
  x = evt.clientX - rect.left;
  y = evt.clientY - rect.top;

  frmtMsg = x + "," + y;

  if(conn === null) {
    return true;
  }
  
  $('#sendAxis').val(frmtMsg);
  log.i('DataChannel - send : ' + frmtMsg);
  conn.send(frmtMsg);
}

/**
 * return device type
 *  @return     sp:SmartPhone, tab:Tablet, other: other
 */
var getDevice = (function(){
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        return 'sp';
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        return 'tab';
    }else{
        return 'other';
    }
})();
