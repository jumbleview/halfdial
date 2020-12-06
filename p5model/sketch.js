// Get coordinates from a rotation (x, y, radius, angle)
function getPolar(x, y, r, a) {
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

function drawDial(x0, y0, rs, delta, isHalf) {
  strokeWeight(1);
  stroke(0, 0, 0);
  for (let a = 0; a < 360; a += 30) {
    if (isHalf && (a > 90 && a < 270)) {
      continue ;
    }
    let startMark = getPolar(x0, y0, rs, a);
    let endMark =  getPolar(x0, y0, rs + delta, a);
    line(startMark[0],startMark[1],endMark[0],endMark[1]);
  }
}

var x = 200;
var y = 175;
var radius = 100;
var radiush = 65;
var angle = 270;
var angleh = 270;
var m = 0;
var minutes;
function setup() {
  createCanvas(1000, 350);
}


function draw() {
  background(220);
  drawDial(x, y, radius + 15, 15, false); 
  drawDial(3*x, y, radius + 15, 15, false);  
  drawDial(4*x, y, radius + 15, 15, true); 

  if (!mouseIsPressed) {
    angle+=1;
    if (angle%12 === 0 ) {
      angleh++;
    }
    
    if (angle === 360) {
      angle = 0;
    }
    
    if (angleh === 360) {
      angleh = 0;
    }
    m += 1/6;
    if (m >= 720) {
      m = 0;
    }
  }

  textSize(28);
  minutes = Math.floor(m);
  let sm = (minutes%60).toFixed(0);  
  let sh = Math.floor(minutes/60).toFixed(0);

  if (sh.length === 1 ) {
    sh = "0" + sh
  }
  if (sm.length === 1 ) {
    sm = "0" + sm
  }

  let simTime = sh + ":" + sm ;
  text(simTime,2*x,35); 

  strokeWeight(10);

  // Full dial arcs 
  noFill()
  stroke(255, 255, 255); // Clock minutes  (White)
  arc(x, y, 2*radius, 2*radius, radians(270), radians(angle))
  stroke(0, 255, 0); // Clock hours (green)
  arc(x, y, 2*radiush, 2*radiush, radians(270), radians(angleh))

  // Hours hand
  stroke(255, 255, 255); // Clock minutes hand (White)
  var newPos = getPolar(3*x, y, radius, angle);
  line(3*x, y, newPos[0], newPos[1]);
  stroke(0,255, 0);   // Hours hand (green)
  var newPosh = getPolar(3*x, y, radiush, angleh);
  line(3*x, y, newPosh[0], newPosh[1]);



  // Half dial arcs
  stroke(255, 255, 255); // Clock minutes (White)
  if (angle <= 90 ||  angle >= 270) {
    arc(4*x, y, 2*radius, 2*radius, radians(270), radians(angle))
  } else {
    arc(4*x, y, 2*radius, 2*radius, radians(180 - angle), radians(90))
  }
  stroke(0, 255, 0); // Clock hours (Green)
  if (angleh < 90 ||  angleh >= 270) {
    arc(4*x, y, 2*radiush, 2*radiush, radians(270), radians(angleh))
  } else {
    arc(4*x, y, 2*radiush, 2*radiush, radians(180 - angleh), radians(90))
  }
  frameRate();
}