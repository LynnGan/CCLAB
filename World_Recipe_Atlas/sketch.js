let globe;
let parchmentTexture, compass, worldMap;
let compassVisible = true;
let recipes;
let popup = null;//textbox popup
let easterEgg1 = false; //egg1 appears once

// Variables for globe rotation with mouse
let rotationX = 0;   // up/down tilt (degrees)
let rotationY = 0;   // left/right spin (degrees)
let lastMouseX = 0;
let lastMouseY = 0;
let dragging = false;

let selectedIndex = 0;// Track selected recipe index

// Easter Egg state tracking
let compassClicks = 0;
let showMusicMsg = false;
let musicMsgTimer = 0;
let showGlitch = false;
let glitchTimer = 0;
let showEnoughMsg = false;
let enoughMsgTimer = 0;
let bgMusic;
let musicStarted = false;
let midnightPopup = null;


function preload() { // load assets
  parchmentTexture = loadImage("assets/parchment.jpg"); // Background
  recipes = loadJSON("assets/recipe.json"); //recipe json
  compass = loadImage("assets/compass.png"); //compass image
  bgMusic = loadSound("assets/my_dearest_friends.mp3"); //bgm
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  globe = new Globe();
  textFont("Palatino");
}

// Utility: check if time is midnight–4am
// Used to unlock hidden recipe (Starlight Onigiri)
//AI guided
function isMidnightWindow() {
  // midnight–4am local time
  const h = (typeof hour === 'function') ? hour() : (new Date()).getHours();
  return (h >= 23 || h < 4);
}

function draw() {
  background(parchmentTexture);


  //speical midnight event
  if (midnightPopup) {
    midnightPopup.draw();
    return;
  }

  //draw compass upper left
  if (compassVisible) {
    push();
    image(compass, 50, 50, 175, 175);
    blendMode(MULTIPLY);
    pop();
  }

  //egg2: music
  if (showMusicMsg) {
    push();
    fill(6, 79, 53);
    textAlign(CENTER, CENTER);
    textSize(40);
    textFont("Impact");
    text("Ok! Fine! I will give you some music. Now stop bothering me!", width / 2, height / 2);
    blendMode(MULTIPLY);
    pop();
    //hides message after 1.2 sec
    if (millis() - musicMsgTimer > 1200) {
      showMusicMsg = false;
    }
  }

  //egg3: glitch
  if (showGlitch) {
    push();
    //tentacle-like lines
    for (let i = 0; i < 50; i++) {
      stroke(random(20, 80), random(100, 255), random(20, 80), 180);
      strokeWeight(random(2, 8));
      let x1 = random(width);
      let y1 = random(height);
      let x2 = x1 + random(-100, 100);
      let y2 = y1 + random(-100, 100);
      line(x1, y1, x2, y2);
    }
    // overlay, dark, pulse
    fill(0, random(100, 180));
    rect(0, 0, width, height);

    // creepy text
    textAlign(CENTER, CENTER);
    textSize(40);
    textFont("Papyrus");
    fill(random(0, 100), random(200, 255), random(0, 100));
    text("What are you looking for?", width / 2, height / 2);
    pop();

    //hides message after 1.2 sec
    if (millis() - glitchTimer > 1200) {
      showGlitch = false;
    }
  }

  // egg4: glitch effect and "ENOUGH IS ENOUGH" (10 clicks)
  if (showEnoughMsg) {
    push();
    for (let i = 0; i < 50; i++) {
      fill(random(120, 180), random(0, 40), random(0, 40), 180);
      rect(random(width), random(height), random(20, 100), random(10, 50));
    }
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(random(120, 180), random(0, 40), random(0, 40));
    text("ENOUGH IS ENOUGH", width / 2, height / 2);
    pop();

    //hides message after 3.5 sec
    if (millis() - enoughMsgTimer > 3500) {
      showEnoughMsg = false;
    }
  }


  //make obj into array, prepare recipe
  const list = Array.isArray(recipes) ? recipes : Object.values(recipes);
  const night = isMidnightWindow();

  // hide "Starlight Onigiri" unless it’s midnight
  const displayList = list.filter(r => r.name !== "Starlight Onigiri" || night);

  globe.drawBase(displayList);
  blendMode(MULTIPLY);
  globe.Hover(displayList);
  blendMode(BLEND);


  if (popup) {
    popup.draw();
  } else {
    fill(0);
    textAlign(CENTER);
    textSize(25);
    text("Click on a dot to see a recipe!", width / 2, height - 50);
  }

}

// Globe Class
// Handles globe outline, plotting recipes, hover text, and projection math
class Globe {
  constructor() {
    this.radius = windowHeight / 2.50;
  }

  //draw the globe base with outline and recipes
  drawBase(list) {
    this.drawOutline();
    this.plotRecipes(list);
  }

  //draw the globe outline
  drawOutline() {
    noFill();
    stroke("#2a2119");
    strokeWeight(2);
    ellipse(width / 2, height / 2, this.radius * 2);
    strokeWeight(1);
    stroke("#c2a66b");
    ellipse(width / 2, height / 2, this.radius * 2 + 4);
  }

  //plot recipes on the globe surface
  plotRecipes(list) {
    for (let i = 0; i < list.length; i++) {
      const lat = list[i].coordinates.lat;
      const lon = list[i].coordinates.long;
      const p = this.project(lat, lon);
      if (!p) continue;

      //if hidden recipe, then lighter color
      const isHidden = (list[i].hidden === true) || (list[i].name === "Starlight Onigiri");
      push();
      noStroke();
      blendMode(MULTIPLY); // apply before drawing
      fill(isHidden ? "#e0d5ba" : "#6E4F2A");  // different color if hidden
      ellipse(p.x, p.y, map(p.depth, 0, this.radius, 2, 6));
      pop();
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
// Popup Class
// Draws recipe info (story or recipe view)

class Popup {
  constructor(recipe, x, y) {
    this.recipe = recipe;
    this.x = x;
    this.y = y;

    this.w = 320; // width of popup
    this.h = 440; // height of popup

    //load image
    if (recipe.image && recipe.image != "") {
      this.image = loadImage(recipe.image);
    } else {
      this.image = null;
    }

    // "View recipe" button, will use later
    this.buttonW = 110, this.buttonH = 22;
    this.buttonX = this.x + 10, this.buttonY = this.y + this.h - 30;
    // view state:false:story view, true:recipe view
    this.showRecipe = false;
  }

  draw() {
    if (this.recipe.name === "Starlight Onigiri") {
      //glowing aura behind box for hidden
      push();
      noStroke();
      for (let i = 0; i < 3; i++) {
        fill(180, 180, 255, 40 - i * 10);
        ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w + 40 + i * 20, this.h + 40 + i * 20);
      }
      pop();
      // Magical blurb
      fill(220, 220, 255);
      textAlign(CENTER, TOP);
      textSize(16);
      textStyle(ITALIC);
      textSize(20);
      text("✨ A midnight snack for dreamers ✨", this.x + this.w / 2, this.y - 10);
      textStyle(NORMAL);
    }
    //box
    fill(255, 255, 255, 220);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 6);

    // names
    fill(0);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(14);
    const name = (this.recipe.name).trim();
    const local = (this.recipe.local_name).trim();

    if (local && local.toLowerCase() !== name.toLowerCase()) {
      text(local + " (" + name + ")", this.x + 10, this.y + 10);
    } else {
      text(name, this.x + 10, this.y + 10);
    }

    // image: only show image in story view
    if (this.image && !this.showRecipe) {
      image(this.image, this.x + 10, this.y + 30, 80, 80);
    }

    // origin story
    textSize(10);
    if (!this.showRecipe) {
      //story
      text(this.recipe.origin_story, this.x + 110, this.y + 34, this.w - 120, this.h - 80);

      // button
      this.drawButton(this.buttonX, this.buttonY, this.buttonW, this.buttonH, "View recipe");
    } else {
      //recipe
      let x0 = this.x + 10;
      let y0 = this.y + 34;
      const gap = 23;
      const maxW = this.w - 20;

      textStyle(BOLD);
      text("Ingredients:", x0, y0, maxW);
      textStyle(NORMAL);
      y0 += gap;

      for (let i = 0; i < this.recipe.ingredients.length; i++) {
        text("• " + this.recipe.ingredients[i], x0, y0, maxW);
        y0 += gap;
      }

      y0 += 10;
      textStyle(BOLD);
      text("Steps:", x0, y0, maxW);
      textStyle(NORMAL);
      y0 += gap;


      for (let i = 0; i < this.recipe.steps.length; i++) {
        text("• " + this.recipe.steps[i], x0, y0, maxW);
        y0 += gap;
      }


      // button
      this.drawButton(this.buttonX, this.buttonY, this.buttonW, this.buttonH, "Back");
    }


  }
  //button for popup
  drawButton(x, y, w, h, label) {
    fill(200, 150, 50);
    noStroke();
    rect(x, y, w, h, 6);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(label, x + w / 2, y + h / 2 + 1);
  }

  //button detection
  isButtonClicked(mx, my) {
    return (
      mx >= this.buttonX && mx <= this.buttonX + this.buttonW &&
      my >= this.buttonY && my <= this.buttonY + this.buttonH
    );
  }
}


// Mouse interactions
function mousePressed() {
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  dragging = true;

  //easter egg
  if (mouseX > 50 && mouseX < 225 && mouseY > 50 && mouseY < 225 && compassVisible) {
    compassClicks++;
    // 3 clicks: music + message
    if (compassClicks === 3 && !musicStarted) {
      bgMusic.loop();
      showMusicMsg = true;
      musicMsgTimer = millis();
      musicStarted = true;
    }
    // 8 clicks: glitch + "What are you looking for?"
    if (compassClicks === 8) {
      showGlitch = true;
      glitchTimer = millis();
    }
    // 10 clicks: glitch + "ENOUGH IS ENOUGH" + hide compass
    if (compassClicks === 10) {
      showEnoughMsg = true;
      enoughMsgTimer = millis();
      compassVisible = false;

    }
  }
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
  const night = isMidnightWindow();

  // If popup exists, check button first
  if (popup && popup.isButtonClicked(mouseX, mouseY)) {
    popup.showRecipe = !popup.showRecipe; // toggle between story/recipe
    return;
  }

  let selected = false; // flag to check if a recipe was clicked
  if (!easterEgg1) {
    console.log("%c🌎 World Recipe Atlas 🌍\nYou found the secret console message!\nHappy exploring!", "color: #c2a66b; font-size: 18px; font-family: Palatino;");
    easterEgg1 = true;
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].name === "Starlight Onigiri" && !night) continue;
    // skip if not midnight–4am
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


