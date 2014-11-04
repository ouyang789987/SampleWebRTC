var APIKEY = './license.json';

function init() {
    // load Peerjs API key
    $.ajax(APIKEY, null)
    .done(function( data ) {
        if( data.APIKEY) {
           setAPI(data.APIKEY);
        }
    });
}

function setAPI(key) {
    console.log("apikey " + key);
}


window.addEventListener('load', init, false);
