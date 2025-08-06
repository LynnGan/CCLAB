function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  background(30);
  orbitControl();
  rotateY(frameCount * -0.002);
  rotateX(frameCount * -0.002);
  noFill();
  stroke(255, 30);
  strokeWeight(1);
  sphere(windowWidth / 6, 10, 10);
}
