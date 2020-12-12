// toCartesian calculates point coordinates based on coordinates of
// center, mRadius and angle (in degrees)
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
// drawDial draws Clock dial based on center coordinates, mRadius, length of dial
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
var mRadius = 130;
var hRadius = 90;
var m = 0;
var minutes=0;
let hours=0;
let mAngle=0;
let hAngle=0;

let xLed = 900;
let yLed = 525;
let rmLed = 140;
let rhLed = 90;

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
  drawDial(xClock, y, mRadius + 15, 15, false); 
  drawDial(xDial, y, mRadius + 15, 15, false);  
  drawDial(xHalfDial, y, mRadius + 15, 15, true); 

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

  text("12", xLed -20, yLed - rmLed -20)
  text("3 / 9", xLed + rmLed + 20, yLed + 10)
  text("6", xLed -10, yLed + rmLed + 40)

  noFill()
  strokeWeight(10);
  // Regular Clock with Hands
  stroke(255, 255, 255); // Clock minutes hand (White)
  var newPos = toCartesian(xClock, y, mRadius, mAngle);
  line(xClock, y, newPos[0], newPos[1]);
  stroke(0,255, 0);   // Hours hand (green)
  var newPosh = toCartesian(xClock, y, hRadius, hAngle);
  line(xClock, y, newPosh[0], newPosh[1]);

  // Full Dial Arcs Clock
  stroke(255, 255, 255); // Clock minutes  (White)
  arc(xDial, y, 2*mRadius, 2*mRadius, radians(270), radians(mAngle))
  stroke(0, 255, 0); // Clock hours (green)
  arc(xDial, y, 2*hRadius, 2*hRadius, radians(270), radians(hAngle))

  // Half Dial Arc Clock
  stroke(255, 255, 255); // Clock minutes (White)
  if (mAngle <= 90 ||  mAngle >= 270) {
    arc(xHalfDial, y, 2*mRadius, 2*mRadius, radians(270), radians(mAngle))
  } else {
    arc(xHalfDial, y, 2*mRadius, 2*mRadius, radians(180 - mAngle), radians(90))
  }
  stroke(0, 255, 0); // Clock hours (Green)
  if (hAngle < 90 ||  hAngle >= 270) {
    arc(xHalfDial, y, 2*hRadius, 2*hRadius, radians(270), radians(hAngle))
  } else {
    arc(xHalfDial, y, 2*hRadius, 2*hRadius, radians(180 - hAngle), radians(90))
  }
 
  // Led Half Dial Clock
  mAngle = Math.floor(mAngle);
  hAngle = Math.floor(hAngle);
  const minColor = [255,255,255];
  const hourColor = [0,255,0];
  const offColor = [147, 150, 149];
  const setLed = function(ledColor, weight,r,  a) {
    let dot = toCartesian(xLed, yLed, r, a);
    strokeWeight(weight);
    stroke(ledColor[0],ledColor[1],ledColor[2]);
    point(dot[0], dot[1]);    
  }
  const hourToAngle = function (h) {
    if (h < 6) {
      if (h < 3) {
        return (270 + h*30);
      } else {
        return (h-3)*30;
      }
    } else {
      let dh = h - 6
      if ( h <= 9 ) {
        return (90 - dh*30);
      } else {
        dh = h - 9;
        return (360 - dh*30)
      }
    }
  }
  const minToAngle = function (m) {
    if (m < 30) {
      if (m < 15) {
        return (270 + m*6);
      } else {
        return (m-15)*6;
      }
    } else {
      let dm = m - 30
      if ( m <= 45 ) {
        return (90 - dm*6);
      } else {
        dm = m - 45;
        return (360 - dm*6)
      }
    }
  }

  let ih = Math.floor(hours);
  if (ih < 6) {
    for (let i = 0; i <= 6 ; i++) {
      let ha = hourToAngle(i);
      if (i <= ih) {
        setLed(hourColor, 15,rhLed, ha);            
      } else {
        setLed(offColor, 15,rhLed, ha);    
      }
    }
  } else {
    for (let i = 6; i <=12; i++) {
      let ha = hourToAngle(i);
      if (i <= ih) {
        setLed(hourColor, 15,rhLed, ha);            
      } else {
        setLed(offColor, 15,rhLed, ha);    
      }
    }
  }  

  let im = Math.floor(minutes);
  if (im < 30) {
    for (let i = 0; i <= 30 ; i++) {
      let mw = 5;
      if (i%5 === 0 ){
        mw = 15;
      }
      let ma = minToAngle(i);
      if (i <= im) {
        setLed(minColor, mw,rmLed, ma);            
      } else {
        setLed(offColor, mw,rmLed, ma);    
      }
    }
  } else {
    for (let i = 30; i <= 60; i++) {
      let mw = 5;
      if (i%5 === 0 ){
        mw = 15;
      }
      let ma = minToAngle(i);
      if (i <= im) {
        setLed(minColor, mw,rmLed, ma);            
      } else {
        setLed(offColor, mw,rmLed, ma);    
      }
    }
  }  

/*
  let dAngle = 270;
  for (dAngle = 270; dAngle < 360; dAngle +=6) {
    let minWeight = 5;
    if (dAngle%5 === 0)   {
      //setLed(hourColor, 15,rhLed, dAngle);
      minWeight = 15;
    }
    setLed(minColor,minWeight, rmLed, dAngle)
  }
  for (dAngle = 0; dAngle <= 90; dAngle +=6) {
    let hColor = offColor;
    let mColor = offColor;
    let minWeight = 5;
    if (dAngle%5 === 0)   {
      //setLed(hColor, 15,rhLed, dAngle);
      minWeight = 15;
    }
    setLed(mColor,minWeight, rmLed, dAngle)
  }
*/
  frameRate(10);
}