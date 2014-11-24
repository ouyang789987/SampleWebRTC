// Constant
var APIKEY = './license.json'; // Peer.js API key
var DEBUG = 3; // Debug level
var MESSAGES = {
    'KEY_NOT_FOUND' : 'API key is Not Found'
}

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
      myPeerId = id;
      $('#my-id').html(id);
  });

  // Sender Callbacs
  function callTo(peerId) {

    log.i("CallTo()");
    if(!peer) {peer = new Peer({key: apikey, debug : DEBUG})};

    var call = peer.call(peerId, myStream);

    call.on('stream', function(othersStream) {
      $('#remote-videos').prop('src', URL.createObjectURL(othersStream));
    });
  }

  function connectTo(myPeer, remotePeerId, myPeerId) {
      log.i("connectTo()");

    if(!conn) { conn = myPeer.connect(remotePeerId, {label : myPeerId}) }; 

    conn.on('open', function() {
      log.i('DataChannel sender open');
      conn.on('data', function(data) {
        var msg = data;
        log.i('conn - receieved : ' + msg);
        $('#receivedAxis').val(msg);

        // TODO : WebSocketに置き換える
        setTimeout( function() {conn.send(msg); $('#sendAxis').val(msg);}, TIMEOUT_MILLS );
      });
    });
  }

  function closeCall() {
    if(peer) {
      log.i('peer.destroy()');
      peer.destroy();
      peer = null;
      conn = null;
    }
  }

  // Error
  peer.on('error', function(e){
    log.e(e.message);
  });

  // User event callback
  $('#call').on('click', function() {
    if( $('#remoteId').val() == "") {
      return true;
    } 
    callTo($('#remote-id').val());
    connectTo(peer, $('#remote-id').val(), myPeerId);
  });

  // 対向のPeer IDを表示する
  function printMd(ostream) {
    $('#remote-ids').append("<div>" + ostream.label  + "</div>");
  }

}

window.addEventListener('load', init, false);
