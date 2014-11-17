// Constant
var APIKEY = './license.json'; // Peer.js API key
var DEBUG = 3; // Debug level
var MESSAGES = {
    'KEY_NOT_FOUND' : 'API key is Not Found'
}

var KEY_ENTER = 13;

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

  // Setup peer object and callbacks
  var peer = new Peer({key: apikey, debug : DEBUG});
  var myPeerId = "";

  // DataConnection
  var conn = null;

  peer.on('open', function(id) {
    myPeerId = id;
    $('#myID').html(myPeerId);
  });

  // Sender Callbacs
  function connectTo(myPeer, remotePeerId, myPeerId) {
    log.i("connectTo()");

    if(!conn) { conn = myPeer.connect(remotePeerId, {label : myPeerId}) }; 

    conn.on('open', function() {
      conn.on('data', function(data) {
        $('#chat').append(data + "<br>");
      });
    });

  }

  // Receiver callbacks
  peer.on('connection', function(c) {
    log.i('connect ' + c.label);

    // Remind remote connection
    conn = c;
    c.on('open', function() {
      log.i('open');
      c.on('data', function(data) {
        var msg = data;
        $('#chat').append(msg + "<br>");
      });
    });

  });

  // Sender/Receiver callbacks
  function closeConnect() {
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
  $('#sendMsg').keypress(function(evt){
    if( evt.which == KEY_ENTER ) {

      var msg = $('#sendMsg').val();
      if( msg == "" || conn == null) {
        return true;
      }
      var fmtdMsg = myPeerId + " - " + msg;
      conn.send(fmtdMsg);
      $('#chat').append(fmtdMsg + "<br>");
      $('#sendMsg').val("");
    }
  });

  $('#startConnect').on('click', function() {
    if( $('#remoteId').val() == "") {
      return true;
    } 
    connectTo(peer, $('#remoteId').val(), myPeerId);
  });

  $('#closeConnect').on('click', function() {
    closeConnect();
  });
}

function canvas() {
  $('canvas').mousemove(function(evt) {
    log.i(evt);
  });
}

window.addEventListener('load', init, false);
window.addEventListener('load', canvas, false);
