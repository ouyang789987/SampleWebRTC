var rect = null;
var x, y = 0;
var frmtMsg ="";
var lastTime = null;
var nowTime = null;

function canvasInit() {
  var canvas = $('canvas')[0];
  var ctx = canvas.getContext('2d');
  ctx.strokeStyle = "rgb(200, 0, 0)";

  var lastTime = Date.now();

  if( getDevice === "other") {
    console.log(" Device : PC!");
    $('canvas').mousemove(
      function(evt){
        if( isPastTimeMills() ) trackingMouse(evt);
      });
  } else {
    console.log(" Device : Mobile!!");
    $('canvas').bind('touchmove',
      function() {
        if( isPastTimeMills() ) trackingTouch();
      }); 
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

  if(conn === null) {
    return true;
  }

  $('#sendAxis').val(frmtMsg);
  log.i('DataChannel - send : ' + frmtMsg);
  conn.send(frmtMsg);
}

// マウスの軌跡を取得する
// 指定したFPS以下の頻度で軌跡を送信する
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
* 指定したFPS以下の時間が経過したか判定する
* @return true:指定FPSより時間が経過した．false:経過していない
**/
function isPastTimeMills() {
  
  nowTime = Date.now();

  if( nowTime - lastTime < (ONE_SECOND_MILLS / MAX_FPS) ) {    
    return false;
  }
  console.log(nowTime - lastTime);
  lastTime = nowTime;

  return true;
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
