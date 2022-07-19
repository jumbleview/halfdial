
// Variables
let m = 0;

let button;
let runMode = false;

const xClock = 200;
const y = 200;
const xDial = 700;
const xHalfDial = 1050;
const mRadius = 130;
const hRadius = 50;

const xLed = 700;
const yLed = 600;

const xLed2 = 1050

const rmLed = 140;
const rhLed = 60;
const rmLed2 = 100;

const xDigital = 170;
const yDigital = 550
const xButton = 140;
const yButton = 600;

const xCanvas = 1300;
const yCanvas = 820;

const deltaMin = [315, 345,15, 45];
const deltaMinInv = [ 45, 15, 345, 315];


// toCartesian calculates point coordinates based on coordinates of
// center, radius and angle (in degrees)
function toCartesian(x, y, r, a) {
  // Get angle as radians
  const rad = a*(PI/180);
  // Convert coordinates
  const deltaX = r*cos(rad);
  const deltaY = r*sin(rad);
  // Return array of two cartesian coordinates: x and y
  return [x+deltaX, y+deltaY];
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
  button.position(xButton,yButton);
  button.mousePressed(changeRunMode)
}
// Function 'setup' and 'draw' required by p5 lib.
function setup() {
  createCanvas(xCanvas, yCanvas);
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
  }
  let minutes = m%60;
  let hours = m/60;

  let mAngle = minutes*6 - 90; // 360/60  
  if (mAngle < 0 ) {
    mAngle += 360;
  }
  let hAngle = hours*30 - 90 // 360/12
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
 
  // Half Dial Led Clock

  const smallLed = 7;
  const bigLed = 15;
  
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

  const setLed2 = function(ledColor, weight,r,  a) {
    let dot = toCartesian(xLed2, yLed, r, a);
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
  // Hours Led
  let i = 0;
  let max = 6;
  let ih = Math.floor(hours);
  if (ih >= 6) {
    i = 6;
    max = 12;
  }
  for (; i <= max ; i++) {
    let ha = hourToAngle(i);
    if (i <= ih) {
      setLed(hourColor, bigLed,rhLed, ha); 
      setLed2(hourColor, bigLed,rhLed, ha);                  
    } else {
      setLed(offColor, bigLed,rhLed, ha);
      setLed2(offColor, bigLed,rhLed, ha);          
    }
  }
  // Minutes Led
  i = 0;
  max = 30;
  let im = Math.floor(minutes);
  if ( im >= 30 ) {
    i = 30;
    max = 60;
  }
  for (; i <= max ; i++) {
    let mw = smallLed;
    md =i%5;  
    if ( md === 0 ){
      mw = bigLed;
    }
    let ma = minToAngle(i);
    if (i <= im) {
      setLed(minColor, mw,rmLed, ma);
      if (mw === bigLed) {
        setLed2(minColor, mw,rmLed, ma);
      }
    } else {
      setLed(offColor, mw,rmLed, ma);    
      if (mw === bigLed) {
        setLed2(offColor, mw,rmLed, ma);    
      }
    }
  }
  let dim = im%5
  for (let j = 0; j < 4; j++) {
    let angle = deltaMin[j]
    if (max === 60) {
      angle = deltaMinInv[j]
    }
    if (j < dim) { // turn leds on
      setLed2(minColor, smallLed,rmLed2, angle);
    } else {
      setLed2(offColor, smallLed,rmLed2, angle);
    }
  }
  frameRate(5);
}