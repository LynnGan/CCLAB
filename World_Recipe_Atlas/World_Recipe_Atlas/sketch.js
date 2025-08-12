let globe;
let parchmentTexture, compass ;
let recipes;
let popup = null;//textbox popup

let rotationX = 0;   // up/down tilt (degrees)
let rotationY = 0;   // left/right spin (degrees)
let lastMouseX = 0;
let lastMouseY = 0;
let dragging = false;

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
  console.log("isArray?", Array.isArray(recipes), recipes);

}

function draw() {
  background(parchmentTexture);
  // tint("255, 255, 255, 100");
  
 
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

}




//Globe class 
class Globe {
  constructor() {
    this.radius = windowHeight / 2.50;
  }

  drawBase(list){
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
    ellipse(width / 2, height / 2,this.radius * 2+4);
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

        // // Draw label
        // fill("#6E4F2A");
        // noStroke();
        // textAlign(CENTER);
        // textSize(12);
        // text(list[i].name, p.x, p.y - 10);
        // blendMode(MULTIPLY);
      }
    }
  }

  Hover(list){
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

  for (let i = 0; i < list.length; i++) {
  let lat = list[i].coordinates.lat;
  let lon = list[i].coordinates.long;

  // project that lat/lon into screen coordinates
  let p = globe.project(lat, lon);

  if (p) { // if on the front side
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d <= 3) {
      console.log("clicked on recipe");
    }
  }
}
}

// function mouseClicked(){
  // if dist to recipe <=2 
  // open popup with recipe details
  // popup = new Popup(recipeDetails);
  // popup.show();
  // console.log("clicked on recipe");
  // else if (popup) {
  //   popup.hide();
  //   popup = null;
  // }
  // }
  // if (close button clicked) {
  //   popup.hide();
  //   popup = null;
  // console.log("popup closed");
  
// }

// //draw popup when clicked on dot
// function drawPopup() {
  
// }