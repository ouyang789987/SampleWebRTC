// Constant
var APIKEY = './license.json'; // Peer.js API key
var DEBUG = 3; // Debug level
var MESSAGES = {
    'KEY_NOT_FOUND' : 'API key is Not Found'
}

// Global instance field
// Data connection
var conn = null;

// Logging
var log =  {
    i : function(msg) {
      console.log('Info : ' + msg);
    },
    e : function(msg) {
      console.error('Error : ' + msg);
    }
}

function init() {
    var apikey;

    // load Peerjs API key
    $.ajax({
        async : false, 
        type : 'GET',
        url : APIKEY,
        dataType : 'json',
        success: function(json) {
            apikey = json.APIKEY;
        }
    });

    printUA();
    setupPeerjs(apikey);
    initUI();
}

// User-Agentをブラウザに表示する
function printUA() {
    $('#ua').html(navigator.userAgent);
}

// Setup Peerjs
function setupPeerjs(apikey) {
  if(!apikey) {
    $('#error').html(MESSAGES.KEY_NOT_FOUND);

      return false;
  }

  // Set My stream
  var myStream;

  // Vendor prefixはChrome38で必須
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  navigator.getUserMedia(
      {audio : true, video : true},
      function(stream) {
          myStream = stream;
          $('#my-video').prop('src', URL.createObjectURL(stream));
     },
     function(e){
      log.e(e);
      console.trace(e);
     });

  // Setup peer object and callbacks
  var peer = new Peer({key: apikey, debug : DEBUG});

  var myPeerId = "";

  peer.on('open', function(id) {
      log.i(id);
      $('#my-id').html(id);
  });

  // Receiver callbacks
  peer.on('call', function(call) {
    call.answer(myStream);

    call.on('stream', function(othersStream) {
      $('#remote-video').prop('src', URL.createObjectURL(othersStream));
    });
  });

  // DataConnection
  peer.on('connection', function(c) {
    log.i('connect ' + c.label);

    // Remind remote connection
    conn = c;
    c.on('open', function() {
      log.i('DataChannel open');
      c.on('data', function(data) {
        var msg = data;

        log.i('DataChannel - receieved : ' + msg);
        $('#receivedAxis').val(msg);

        var axis = data.split( ',' );
        var x = axis[0];
        var y = axis[1];
        var canvas = $('canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.lineWidth = 10;
        ctx.strokeStyle = "rgb(204, 0, 0)";

        ctx.clearRect(0, 0, VGA_WIDTH_PX, VGA_HEIGHT_PX);
        ctx.strokeRect(x - MARKER_SIZE_Y/2,
                               y - MARKER_SIZE_Y/2,
                               MARKER_SIZE_X, MARKER_SIZE_Y);
      });

      printRemoteLabel(c.label);
    });
  });

  function closeCall() {
    if(peer) {
      log.i('closeCall()');
      peer.destroy();
      peer = null;
    }
  }

  // Error
  peer.on('error', function(e){
    log.e(e.message);
  });

  /* User event handler */
  $('#close-call').on('click', function() {
    closeCall();
  });

  // ミュート/非ミュートの切り替え
  $('#mute').on('click', function() {
    var isMute = $('#my-video').prop('muted');

    if( isMute ) {
      $('#my-video').prop('muted', false);
      $('#mute').text('Mute');
    } else {
      $('#my-video').prop('muted', true);
      $('#mute').text('Unmute');
    }
  });

  // ミュート/非ミュートの切り替え
 $('#remote-mute').on('click', function() {
    var isMute = $('#remote-video').prop('muted');

    if( isMute ) {
      $('#remote-video').prop('muted', false);
      $('#remote-mute').text('Remote Mute');
    } else {
      $('#remote-video').prop('muted', true)
      $('#remote-mute').text('Remote Unmute');
    }
  });

  // 対向のPeer IDを表示する
  function printRemoteLabel(remoteLabel) {
    $('#remote-ids').append("<div>" + remoteLabel + "</div>");
  }
}

function initUI(){
  var isMute = $('#my-video').prop('muted');

  if( isMute ) {
    $('#my-video').prop('muted', false);
    $('#mute').text('Mute');
  } else {
    $('#my-video').prop('muted', true);
    $('#mute').text('Unmute');
  }

  isMute = $('#remote-video').prop('muted');

  if( isMute ) {
    $('#remote-video').prop('muted', false);
    $('#remote-mute').text('Remote Mute');
  } else {
    $('#remote-video').prop('muted', true);
    $('#remote-mute').text('Remote Unmute');
  }
}

window.addEventListener('load', init, false);
