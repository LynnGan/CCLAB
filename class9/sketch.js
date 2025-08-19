let particles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  background(0);
}

function draw() {
  background(0, 30); // trails

  // make particles
  let x = mouseX + random(-5, 5);
  let y = mouseY + random(-5, 5);
  let size = random(3, 10);
  particles.push(new Particle(x, y, size));

  // show particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.fall();
    p.move();
    p.display();
  }

  // keep it light
  while (particles.length > 500) {
    particles.splice(0, 1);
  }


  // random horizontal tearing lines
  stroke(0, 255, 100, 40);
  strokeWeight(random(1, 5));
  for (let i = 0; i < 10; i++) {
    let yLine = random(height);
    line(0, yLine, width, yLine);
  }

  // random flashing blocks
  noStroke();
  fill(0, 200, 100, 50);
  for (let i = 0; i < 5; i++) {
    let rx = random(width);
    let ry = random(height);
    rect(rx, ry, random(30, 120), random(5, 20));
  }
}

// ---------------- Particle ----------------
class Particle {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-2, -0.5);
  }
  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  fall() {
    this.ySpeed += random(-0.05, 0.05); // “unnatural” gravity
  }
  display() {
    noStroke();
    fill(0, 255, 100, 150); // eerie green
    ellipse(this.x, this.y, this.size);
  }
}
