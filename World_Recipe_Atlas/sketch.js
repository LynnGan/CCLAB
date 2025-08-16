let globe;
let parchmentTexture, compass, worldMap;
let recipes;
let popup = null;//textbox popup

let rotationX = 0;   // up/down tilt (degrees)
let rotationY = 0;   // left/right spin (degrees)
let lastMouseX = 0;
let lastMouseY = 0;
let dragging = false;

let selectedIndex = 0;

function preload() { // load assets
  parchmentTexture = loadImage("assets/parchment.jpg");
  recipes = loadJSON("assets/recipe.json"); // not used yet
  compass = loadImage("assets/compass.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  globe = new Globe();
  textFont("Palatino");
}

function draw() {
  background(parchmentTexture);

  //draw compass upper left
  push();
  image(compass, 50, 50, 175, 175);
  blendMode(MULTIPLY);
  pop();

  //make obj into array
  const list = Array.isArray(recipes) ? recipes : Object.values(recipes);

  globe.drawBase(list);
  blendMode(MULTIPLY);
  globe.Hover(list);
  blendMode(BLEND);

  if (popup) {
    popup.draw();
  } else {
    fill(0);
    textAlign(CENTER);
    text("Click on a dot to see a recipe!", width / 2, height - 50);
  }
}


//Globe class 
class Globe {
  constructor() {
    this.radius = windowHeight / 2.50;
  }

  drawBase(list) {
    this.drawOutline();
    this.plotRecipes(list);
  }

  drawOutline() {
    noFill();
    stroke("#2a2119");
    strokeWeight(2);
    ellipse(width / 2, height / 2, this.radius * 2);
    strokeWeight(1);
    stroke("#c2a66b");
    ellipse(width / 2, height / 2, this.radius * 2 + 4);
  }

  plotRecipes(list) {
    for (let i = 0; i < list.length; i++) {
      let lat = list[i].coordinates.lat;
      let lon = list[i].coordinates.long;

      let p = this.project(lat, lon);
      if (p) {
        // Draw point
        fill("#6E4F2A");
        noStroke();
        ellipse(p.x, p.y, map(p.depth, 0, this.radius, 2, 6));
        blendMode(MULTIPLY);
      }
    }
  }

  Hover(list) {
    //mouse hover over a recipe, name appears
    for (let i = 0; i < list.length; i++) {
      let lat = list[i].coordinates.lat;
      let lon = list[i].coordinates.long;

      let p = this.project(lat, lon);
      if (p) {
        let d = dist(mouseX, mouseY, p.x, p.y);
        if (d <= 2) {
          fill("#6E4F2A");
          noStroke();
          textAlign(CENTER);
          textSize(12);
          text(list[i].name, p.x, p.y - 10);
          blendMode(MULTIPLY);
        }
      }
    }
  }

  // Project latitude and longitude onto the globe surface, return screen x,y
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

// popup class
class Popup {
  constructor(recipe, x, y) {
    this.recipe = recipe;
    this.x = x;
    this.y = y;

    this.w = 300; // width of popup
    this.h = 200; // height of popup

    if (recipe.image && recipe.image != "") {
      this.image = loadImage(recipe.image);
    } else {
      this.image = null;
    }
  }

  draw() {
    //box
    fill(255, 255, 255, 220);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 6);

    // names
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    const name = (this.recipe.name || "").trim();
    const local = (this.recipe.local_name || "").trim();

    if (local && local.toLowerCase() !== name.toLowerCase()) {
      text(local + " (" + name + ")", this.x + 10, this.y + 10);
    } else {
      text(name, this.x + 10, this.y + 10);
    }

    // image
    if (this.image) {
      image(this.image, this.x + 10, this.y + 30, 80, 80);
    }

    // origin story
    textSize(10);
    text(this.recipe.origin_story, this.x + 100, this.y + 30, this.w - 110, this.h - 60);

    // "View recipe" button
    const buttonW = 110, buttonH = 22;
    const buttonX = this.x + 10, buttonY = this.y + this.h - 30;
    fill(200, 150, 50);
    noStroke();
    rect(buttonX, buttonY, buttonW, buttonH, 6);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("View recipe", buttonX + buttonW / 2, buttonY + buttonH / 2 + 1);
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


// Simple click (separate from drag): open popup if near a spot from plotrecipe
function mouseClicked() {
  const list = Array.isArray(recipes) ? recipes : Object.values(recipes);


  let selected = false; // flag to check if a recipe was clicked
  for (let i = 0; i < list.length; i++) {
    let lat = list[i].coordinates.lat;
    let long = list[i].coordinates.long;

    // project that lat/lon into screen coordinates
    let p = globe.project(lat, long);

    if (p) { // if on the front side
      let d = dist(mouseX, mouseY, p.x, p.y);
      if (d <= Math.abs(3)) {
        // if clicked near a recipe, open popup
        popup = new Popup(list[i], p.x, p.y);
        selected = true; // set flag to true
      }
    }
  }
  if (!selected) {
    popup = null; // if no recipe was clicked, close popup
  }
}



//------------Easter Egg------------------
//if compass clicked 8 times compass falls off 
// let compassClicks = 0;
// let compassX = 50
// function mousePressed() {
//   if (mouseX < 225 && mouseY < 225) {
//     compassClicks++;
//     if (compassClicks = 8 && compass.y < height) {
//       //compass falls off to bottom of screen
//       image(compass, 50, compassX + 5, 175, 175);
//       console.log("Compass removed!");
//     }

//   }
// }

