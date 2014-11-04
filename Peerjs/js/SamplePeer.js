// Constant
var APIKEY = './license.json';
var MESSAGES = {
    'KEY_NOT_FOUND' : 'API key is Not Found'
}

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
    $('#userEnv').html(navigator.userAgent);
}

// Setup Peerjs
function setupPeerjs(apikey) {
  if(!apikey) {
    $('#ErrMsg').html(MESSAGES.KEY_NOT_FOUND);

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
          $('#video').prop('src', URL.createObjectURL(stream));
     },
     function(e){
      log.e(e);
      console.trace(e);
     });

  // Setup peer object and callbacks
  var peer = new Peer({key: apikey});

  peer.on('open', function(id) {
      log.i(id);
      $('#myID').html(id);
  });

  // Sender Callbacs
  function callTo(peerId) {
    var call = peer.call(peerId, myStream);

    call.on('stream', function(othersStream) {
    $('#others-video').prop('src', URL.createObjectURL(othersStream));
    });
  }

  // Receiver callbacks
  peer.on('call', function(call) {
    call.answer(myStream);

    call.on('stream', function(othersStream){
      $('#others-video').prop('src', URL.createObjectURL(othersStream));
    });
  });

  // Error
  peer.on('error', function(e){
    log.e(e.message);
  });

  // Event handler 
  $('#call').on('click', function() {
    callTo($('#others-id').val());
  });
}

window.addEventListener('load', init, false);