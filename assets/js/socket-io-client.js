/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


 (function (io) {

  // as soon as this file is loaded, connect automatically, 
  var socket = io.sails.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js... Edited');
  }

  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('joinGame', function messageReceived(message) {
      log('Opponenet Joined ', message);
        window.isMyturn = true;
    });
    socket.on('noroom', function messageReceived(message) {
      log('New comet message received :: ', message);
    });
    socket.on('message', function messageReceived(message) {
      log('New comet message received :: ', message);
      window.onPlay(message);
    });
     socket.on('created', function messageReceived(message) {
      log('Game created ', message);
        window.isMyturn = false;
    });
  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }
  

})(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

  );