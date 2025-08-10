let globe;
let parchmentTexture;
let recipes;

let rotationX = 0;   // up/down tilt (degrees)
let rotationY = 0;   // left/right spin (degrees)
let lastMouseX = 0;
let lastMouseY = 0;
let dragging = false;

function preload() { // load assets
  parchmentTexture = loadImage("assets/parchment.jpg");
  recipes = loadJSON("assets/recipe.json"); // not used yet
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  globe = new Globe();
  textFont("monospace");
  console.log("isArray?", Array.isArray(recipes), recipes);

}

function draw() {
  background(parchmentTexture);
  globe.drawOutline();
  //make obj into array
  const list = Array.isArray(recipes) ? recipes : Object.values(recipes);

  globe.plotRecipes(list);

}


//Globe class 
class Globe {
  constructor() {
    this.radius = windowWidth / 3;
  }

  drawOutline() {
    noFill();
    stroke(120);
    strokeWeight(2);
    ellipse(width / 2, height / 2, this.radius * 2);
  }

  plotRecipes(list) {
    for (let i = 0; i < list.length; i++) {
      let lat = list[i].coordinates.lat;
      let lon = list[i].coordinates.long;

      let p = this.project(lat, lon);
      if (p) {
        // Draw point
        fill(0);
        noStroke();
        ellipse(p.x, p.y, map(p.depth, 0, this.radius, 4, 8));

        // Draw label
        fill(0);
        noStroke();
        textAlign(CENTER);
        textSize(12);
        text(list[i].name, p.x, p.y - 10);
      }
    }
  }


  project(lat, lon) {
    const r = this.radius;

    // degrees -> radians
    const latRad = radians(90 - lat);
    const lonRad = radians(-lon); // flip so dragging left spins left

    // spherical -> Cartesian
    let x = r * sin(latRad) * cos(lonRad);
    let y = r * cos(latRad);
    let z = r * sin(latRad) * sin(lonRad);

    // apply Y (spin) then X (tilt)
    const ry = radians(rotationY);
    const rx = radians(rotationX);

    const x1 = x * cos(ry) - z * sin(ry);
    const z1 = x * sin(ry) + z * cos(ry);

    const y2 = y * cos(rx) - z1 * sin(rx);
    const z2 = y * sin(rx) + z1 * cos(rx);

    if (z2 < 0) return null; // hide back side
    return { x: width / 2 + x1, y: height / 2 - y2, depth: z2 };
  }



}

function mousePressed() {
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  dragging = true;
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  if (!dragging) return;
  const dx = mouseX - lastMouseX;
  const dy = mouseY - lastMouseY;

  rotationY += dx * 0.5;
  rotationX += dy * 0.5;
  rotationX = constrain(rotationX, -89, 89);

  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

