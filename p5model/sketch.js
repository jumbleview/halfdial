// toCartesian calculates point coordinates based on coordinates of
// center, radius and angle (in degrees)
function toCartesian(x, y, r, a) {
  // Get angle as radians
  var fa = a*(PI/180);
  // Convert coordinates
  var dx = r* cos(fa);
  var dy = r* sin(fa);
  
  // Add origin values
  var fx = x + dx;
  var fy  = y + dy;
  
  return [fx, fy];
}
// drawDial draws Clock dial based on center coordinates, radius, length of dial
// mark and bool flag (true in case of half dial, false otherwise)
function drawDial(x0, y0, rs, delta, isHalf) {
  strokeWeight(1);
  stroke(0, 0, 0);
  for (let a = 0; a < 360; a += 30) {
    if (isHalf && (a > 90 && a < 270)) {
      continue ;
    }
    let startMark = toCartesian(x0, y0, rs, a);
    let endMark =  toCartesian(x0, y0, rs + delta, a);
    line(startMark[0],startMark[1],endMark[0],endMark[1]);
  }
}
// Variables
var xClock = 200;
var y = 200;
var xDial = 700;
var xHalfDial = 1050;
const xDigital = 10;
const yDigital = 35
var radius = 130;
var radiush = 90;
var m = 0;
var minutes=0;
let hours=0;
let mAngle=0;
let hAngle=0;
// Function 'setup' and 'draw' required by p5 lib.
let button;
let runMode = true;

function changeRunMode() {
  runMode = !runMode;
  button.remove();
  setButton();
}
function setButton(){
  if (runMode) {
    button = createButton('stop');
  } else {
    button = createButton('start');
  }
  button.style('font-size', '50px');
  let col = color(0,128,255); //use color instead of fill
  button.style('color',col);
  button.position(375,500);
  button.mousePressed(changeRunMode)
}

function setup() {
  createCanvas(1280, 720);
  setButton();
}

function draw() {
  background(220);
  drawDial(xClock, y, radius + 15, 15, false); 
  drawDial(xDial, y, radius + 15, 15, false);  
  drawDial(xHalfDial, y, radius + 15, 15, true); 

  if (runMode) {
    m++;
    if (m === 720) {
      m = 0;
    }
    minutes = m%60;
    hours = m/60;
  }
  mAngle = minutes*6 - 90; // 360/60  
  if (mAngle < 0 ) {
    mAngle += 360;
  }
  hAngle = hours*30 - 90 // 360/12
  if (hAngle < 0 ) {
    hAngle += 360;
  }
  // Digital Clock
  textSize(28);
  let sm = minutes.toFixed(0);  
  let sh = Math.floor(hours).toFixed(0);

  if (sh.length === 1 ) {
    sh = "0" + sh
  }
  if (sm.length === 1 ) {
    sm = "0" + sm
  }

  let simTime = sh + ":" + sm ;
  text(simTime,xDigital,yDigital); 

  noFill()
  strokeWeight(10);
  // Regular Clock with Hands
  stroke(255, 255, 255); // Clock minutes hand (White)
  var newPos = toCartesian(xClock, y, radius, mAngle);
  line(xClock, y, newPos[0], newPos[1]);
  stroke(0,255, 0);   // Hours hand (green)
  var newPosh = toCartesian(xClock, y, radiush, hAngle);
  line(xClock, y, newPosh[0], newPosh[1]);

  // Full Dial Arcs Clock
  stroke(255, 255, 255); // Clock minutes  (White)
  arc(xDial, y, 2*radius, 2*radius, radians(270), radians(mAngle))
  stroke(0, 255, 0); // Clock hours (green)
  arc(xDial, y, 2*radiush, 2*radiush, radians(270), radians(hAngle))

  // Half Dial Arc Clock
  stroke(255, 255, 255); // Clock minutes (White)
  if (mAngle <= 90 ||  mAngle >= 270) {
    arc(xHalfDial, y, 2*radius, 2*radius, radians(270), radians(mAngle))
  } else {
    arc(xHalfDial, y, 2*radius, 2*radius, radians(180 - mAngle), radians(90))
  }
  stroke(0, 255, 0); // Clock hours (Green)
  if (hAngle < 90 ||  hAngle >= 270) {
    arc(xHalfDial, y, 2*radiush, 2*radiush, radians(270), radians(hAngle))
  } else {
    arc(xHalfDial, y, 2*radiush, 2*radiush, radians(180 - hAngle), radians(90))
  }
 
  frameRate(20);
}