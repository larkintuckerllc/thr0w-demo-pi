var SERVER = '52.87.61.17';
var INTERVAL = 300;
var CHANNELS = [0];
var LEFT = 12;
var RIGHT = 40;
var rpio = require('rpio');
var thr0w = require('thr0w-api');
var lastRight = null;
var lastLeft = null;
thr0w.setBase(SERVER);
thr0w.login('admin', 'demo', handleLogin);
function handleLogin(loginError) {
  if (loginError) {
    process.exit(1);
  }
  rpio.open(LEFT, rpio.INPUT);
  rpio.open(RIGHT, rpio.INPUT);
  setInterval(readInterval, INTERVAL);
  function readInterval() {
    var newLeft = rpio.read(LEFT);
    var newRight = rpio.read(RIGHT);
    if (newLeft !== lastLeft) {
      thr0w.thr0w(CHANNELS, {pin: LEFT, action: 'value', value: newLeft});
    }
    if (newRight !== lastRight) {
      thr0w.thr0w(CHANNELS, {pin: RIGHT, action: 'value', value: newRight});
    }
    lastLeft = newLeft;
    lastRight = newRight;
  }
}
