let mySphere;
let recipe;

function preload() {
  recipe = loadJSON("assets/recipe.json");
}



function setup() {
  console.log(recipe[0].name);
  createCanvas(windowWidth, windowHeight, WEBGL);
  mySphere = new referenceSphere();
}

function draw() {
  background(30);
  mySphere.display();
}


class referenceSphere {
  display() {
    orbitControl();
    rotateY(frameCount * -0.002);
    rotateX(frameCount * -0.002);
    noFill();
    stroke(255, 30);
    strokeWeight(1);
    sphere(windowWidth / 6, 10, 10);
  }
}