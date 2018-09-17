// create a canvas element
var canvas = document.createElement("canvas");

// attach element to DOM
document.getElementsByTagName("body")[0].appendChild(canvas);

// background color [r, g, b]
var bg = [0, 20, 30];

// get the canvas context (this is the part we draw to)
var ctx = canvas.getContext("2d");
var looper = new Looper(200);

function setup() {
  // setup the canvas size to match the window
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // set the 0,0 point to the middle of the canvas, this is not necessary but it can be handy
  ctx.translate(canvas.width / 2, canvas.height / 2);
}

// fill entire canvas with a preset color
function fill(rgb, amt) {
  ctx.beginPath(); // start path
  ctx.rect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height); // set rectangle to be the same size as the window
  ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${amt})`; // use the rgb array/color for fill, and amt for opacity
  ctx.fill(); // do the drawing
}

function drawCircle(x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color || "white";
  ctx.fill();
  ctx.closePath();
}

function Particle() {
  // initialize loopers with random trange and offset
  this.loop1 = new Looper(500 + 200 * Math.random(), 1860 * Math.random());
  this.loop2 = new Looper(200 + 250 * Math.random(), 220 * Math.random());
  this.loop3 = new Looper(120 + 20 * Math.random(), 140 * Math.random());
  this.history = [];
  this.history_max = 5;
  this.offset = Math.random(); // some color offset for the color

  this.draw = function() {
    // set x,y, radius, and color params
    var x =
      this.loop1.sin * (canvas.width / 4 - 10) +
      this.loop2.sin * (canvas.width / 6 - 10) +
      this.loop3.sin * 30;
    var y =
      this.loop1.cos * (canvas.height / 4 - 10) +
      this.loop2.cos * (canvas.height / 6 - 10) +
      this.loop3.cos * 30;
    var r = 8 * this.loop3.sinNorm * this.loop3.cosNorm; // set the radius
    var c = `hsla(${280 +
      40 *
        (this.loop3.cosNorm + this.offset) *
        this.loop2.sinNorm}, ${100}%, ${50 + 10 * this.loop3.sin}%, ${1})`;

    ctx.beginPath();
    ctx.strokeStyle = c;
    ctx.lineCap = "round";
    var tx = x;
    var ty = y;
    for (var i = 0; i < this.history.length; i++) {
      ctx.moveTo(tx, ty);
      tx = this.history[i][0];
      ty = this.history[i][1];
      ctx.lineWidth = this.history[i][2];
      ctx.lineTo(tx, ty);
    }
    ctx.stroke();

    this.loop1.update(); // update looper
    this.loop2.update(); // update looper
    this.loop3.update(); // update looper

    this.history.unshift([x, y, r]);
    if (this.history.length > this.history_max) {
      this.history.pop();
    }
  };
}

// initialize a set of particle
var particles = [];
for (var i = 0; i < 90; i++) {
  particles.push(new Particle());
}

function draw() {
  // fill context with background color
  fill(bg, 0.3 + looper.cos * 0.5);

  // update all the particles
  for (var i = 0; i < particles.length; i++) {
    particles[i].draw(); // do it once
  }

  looper.update();

  // this is a draw loop, this will execute frequently and is comparable to EnterFrame on other platform
  window.requestAnimationFrame(function() {
    draw();
  });
}

// start enterFrame loop
window.requestAnimationFrame(draw);

// force running setup
setup();

// re-setup canvas when the size of the window changes
window.addEventListener("resize", setup);

// create a class to hold value and have built in incrementing functionality
function Looper(steps, start) {
  this.val = start || 0; // set value to start value if defined, or 1
  this.steps = steps || 100; // set steps to passed value or default to 100
  this.norm = this.val / this.range; // initialize normalized value (between 0 and 1)
  this.sin = Math.sin(this.norm * Math.PI * 2); // get sine value from norm normalized to [0, 2PI]
  this.sinNorm = (this.sin + 1) / 2; // normalize sin to [0,1]
  this.cos = Math.cos(this.norm * Math.PI * 2); // get cosine value from norm normalized to [0, 2PI]
  this.cosNorm = (this.cos + 1) / 2; // normalize cos to [0,1]

  this.update = function() {
    this.val = (this.val + 1) % this.steps; // update value
    this.norm = this.val / this.steps; // update normalize value (between 0 and 1)
    this.sin = Math.sin(this.norm * Math.PI * 2); // get sine value from norm normalized to [0, 2PI]
    this.sinNorm = (this.sin + 1) / 2; // normalize sine to [0,1]
    this.cos = Math.cos(this.norm * Math.PI * 2); // get cosine value from norm normalized to [0, 2PI]
    this.cosNorm = (this.cos + 1) / 2; // normalize cos to [0,1]
  };
}
