/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new cat(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class cat {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = 50;
    this.angle = 0;
    this.speed = 0.05;

  }
  update() {
    //movement functions
    this.cartwheel();
    this.move();


  }

  cartwheel() {//makes creature flip around on click clockwise
    this.angle += 0.02;
  }

  move() { //the creature would bounce around
    this.x += sin(frameCount * 0.05) * 2;
    this.y += cos(frameCount * 0.08) * 1.5;
  }

  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    this.drawBody(0, 0);
    this.drawHead(0, 0);
    this.drawFace(0, 0);
    this.drawLimbs(0, 0);



    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    this.drawReferenceShapes()
    pop();
  }

  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    // rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }

  drawBody(x, y) {
    noStroke();
    fill(200, 150, 100);
    ellipse(x, y + 20, this.size * 0.8, this.size);

  }

  drawHead(x, y) {
    //the dancer is a cat, the face has eyes mouth and whiskers
    fill(200, 150, 100);
    ellipse(x, y - 30, this.size * 0.8, this.size);
    //ears
    fill(200, 150, 100);
    triangle(x - 30, y - 60, x - 10, y - 60, x - 20, y - 40);
    triangle(x + 30, y - 60, x + 10, y - 60, x + 20, y - 40);

  }

  drawFace(x, y) {
    // eyes
    fill(255);
    ellipse(x - 15, y - 35, 15, 10);
    ellipse(x + 15, y - 35, 15, 10);

    fill(0);
    ellipse(x - 15, y - 35, 7, 7);
    ellipse(x + 15, y - 35, 7, 7);

    // nose
    fill(255, 100, 100);
    triangle(x, y - 30, x - 5, y - 25, x + 5, y - 25);

    // whiskers
    stroke(255);
    strokeWeight(1.5);
    line(x - 10, y - 25, x - 40 - sin(frameCount * 0.2) * 5, y - 20);
    line(x - 10, y - 28, x - 40 - sin(frameCount * 0.2) * 5, y - 28);
    line(x + 10, y - 25, x + 40 + sin(frameCount * 0.2) * 5, y - 20);
    line(x + 10, y - 28, x + 40 + sin(frameCount * 0.2) * 5, y - 28);
  }

  drawLimbs(x, y) {
    stroke(200, 150, 100);
    strokeWeight(8);
    line(x - 10, y + 40, x - 20, y + 80);
    line(x + 10, y + 40, x + 20, y + 80);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/
