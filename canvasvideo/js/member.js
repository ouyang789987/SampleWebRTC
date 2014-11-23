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

  // DataConnection
  // var conn = null;

  peer.on('open', function(id) {
      log.i(id);
      $('#my-id').html(id);
  });

  // Sender Callbacs
  function callTo(peerId) {

    log.i("CallTo()");
    if(!peer) {peer = new Peer({key: apikey, debug : DEBUG})};

    var call = peer.call(peerId, myStream);

    call.on('stream', function(othersStream) {
      // $('#remote-video').prop('src', URL.createObjectURL(othersStream));
    });
  }

  function connectTo(myPeer, remotePeerId, myPeerId) {
      log.i("connectTo()");

    if(!conn) { conn = myPeer.connect(remotePeerId, {label : myPeerId}) }; 

    conn.on('open', function() {
      conn.on('data', function(data) {
        var msg = data;

        log.i('conn sender - receieved : ' + msg);
        $('#receivedAxis').val(msg);

        var axis = data.split( ',' );
        var x = axis[0];
        var y = axis[1];

        var canvas = $('canvas')[0];
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = "rgb(204, 0, 0)";

        ctx.clearRect(0, 0, VGA_WIDTH_PX, VGA_HEIGHT_PX);
        ctx.strokeRect(x, y, 40, 40);
      });
    });
  }

  // Receiver callbacks
  peer.on('call', function(call) {
    call.answer(myStream);

    call.on('stream', function(othersStream) {
      $('#remote-video').prop('src', URL.createObjectURL(othersStream));
    });
  });

  peer.on('connection', function(c) {
    log.i('connect ' + c.label);

    // Remind remote connection
    conn = c;
    c.on('open', function() {
      log.i('open');
      c.on('data', function(data) {
        var msg = data;

        log.i('conn receiver - receieved : ' + msg);
        $('#receivedAxis').val(msg);

        var axis = data.split( ',' );
        var x = axis[0];
        var y = axis[1];
      });
    });
  });

  function closeCall() {
    if(peer) {
      log.i('peer.destroy()');
      peer.destroy();
      peer = null;
    }
  }

  // Error
  peer.on('error', function(e){
    log.e(e.message);
  });

  // Event handler 
  $('#call').on('click', function() {
    if( $('#remoteId').val() == "") {
      return true;
    } 
    callTo($('#remote-id').val());
    connectTo(peer, $('#remote-id').val(), myPeerId);
  });
   // Event handler 
  $('#close-call').on('click', function() {
    closeCall();
  });

}

window.addEventListener('load', init, false);
