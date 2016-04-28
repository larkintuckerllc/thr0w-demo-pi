var SERVER = '192.168.1.19';
var INTERVAL = 300;
var CHANNEL = 0;
var LEFT = 12;
var RIGHT = 40;
var gpio = require('pi-gpio');
var thr0w = require('thr0w-api');
var lastRight = null;
var lastLeft = null;
thr0w.setBase(SERVER);
thr0w.login('admin', 'monkey', handleLogin);
function handleLogin(loginError) {
  if (loginError) {
    process.exit(1);
  }
  gpio.open(RIGHT, 'input', handleRightOpen);
}
function handleRightOpen(openError) {
  if (openError) {
    process.exit(1);    
  }
  gpio.open(LEFT, 'input', handleLeftOpen);
}
function handleLeftOpen(openError) {
  if (openError) {
    process.exit(1);    
  }
  process.on('SIGINT', handleSignal);
  setInterval(readInterval, INTERVAL);
}
function handleSignal() {
  gpio.close(RIGHT);
  gpio.close(LEFT);
  process.exit(0);
}
function readInterval() {
  gpio.read(RIGHT, handleReadRight);
  gpio.read(LEFT, handleReadLeft);
}
function handleReadRight(readError, value) {
  if (readError) {
    return;
  }
  if (value === lastRight) {
    return;
  }
  thr0w.thr0w([CHANNEL], {pin: RIGHT, action: 'value', value: value});
  lastRight = value;
}
function handleReadLeft(readError, value) {
  if (readError) {
    return;
  }
  if (value === lastLeft) {
    return;
  }
  thr0w.thr0w([CHANNEL], {pin: LEFT, action: 'value', value: value});
  lastLeft = value;
}
