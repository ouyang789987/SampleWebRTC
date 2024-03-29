// Constant
var APIKEY = './license.json'; // Peer.js API key
var DEBUG = 3; // Debug level
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

// Connections
var connsMng = function() {
  var conns = {};

  return {
    getConn : function(id) {
      var con = null;
      con = conns[id];
      return con;
    },
    addConn : function(id, conection) {
      if(id) { conns[id] = connection; }
    },
    getLength : function(id) {
      return Object.keys(conns).length;
    },
    getConns : function(id) {
      var list = conns;

      return list;
    }
  }
}();

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
          $('#video').prop('src', URL.createObjectURL(stream));
     },
     function(e){
      log.e(e);
      console.trace(e);
     });

  // Setup peer object and callbacks
  var peer = new Peer({key: apikey, debug : DEBUG});

  peer.on('open', function(id) {
      log.i(id);
      $('#myID').html(id);
  });

  // Sender Callbacs
  function callTo(peerId) {

    if(!peer) {peer = new Peer({key: apikey, debug : DEBUG})};

    var call = peer.call(peerId, myStream);

    addMember(call);

  }

  // Receiver callbacks
  peer.on('call', function(call) {
    call.answer(myStream);

    addMember(call);
  });

  function addMember(call) {
    call.on('stream', function(othersStream){
      $('#others-videos').prepend('<video style="border-style: solid; color: #000000"  width="640" height="480" autoplay></video>');
      $('#others-videos > video:first').prop('src', URL.createObjectURL(othersStream));
      printMd(othersStream);
    });
  }

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
    callTo($('#others-id').val());
  });
  $('#closeCall').on('click', function() {
    closeCall();
  });

  // 対向のStreamを表示する
  function printMd(ostream) {
    $('#labels').append("<div>" + ostream.label  + "</div>");
  }

}

window.addEventListener('load', init, false);
