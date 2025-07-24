/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let progress = 0; //control for circle
let seeNext = false; //next scene trigger
let glowActive = false; //glow conformation

let glowPositions = [];
// textFont("Comic Sans MS");
let glowMessages = ["I’ll take you to the park tomorrow!", "Don’t worry about me…", "Thank you for being with me.", "I’ll show up when you need me.", "I was always waiting for you to speak first.", "I really wanted you to stay that day.", "Let's go out for dinner next week~"];
let clickedGlow = -1;
let glowClicked = Array(7).fill(false); // tracking 7 glows, all initially unclicked

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("p5-canvas-container");
    // createCanvas(800, 500);
    angleMode(DEGREES);
    background(0);

}

function draw() {
    noFill();
    background(0, 50);
    translate(0, 0);

    blendMode(ADD);
    stroke(139, 216, 252, 80);
    noFill();


    //draw circles
    if (progress < 360) {
        progress += 1;
    }

    strokeWeight(2);
    arc(width / 2, height / 2, 300, 300, 0, progress);

    if (progress > 120) {
        arc(width / 2, height / 2, 200, 200, 0, (progress - 240) * 3);
    }

    if (progress > 240) {
        arc(width / 2, height / 2, 100, 100, 0, (progress - 120) * 1.5);
    }
    //draw star, used refrences 
    if (progress >= 360) {
        drawStar(width / 2, height / 2, 50, 120, 5);
    }

    blendMode(BLEND);

    //click and reveal modori
    if (seeNext) {
        fill(255, 200, 0);
        noStroke();
        textSize(32);
        textAlign(CENTER, CENTER);
        push();
        translate(width / 2, height / 2);
        drawModori();
        fill(255);
        textAlign(CENTER, CENTER + 100);
        textSize(25);
        textFont("Comic Sans MS");
        text("✨This is Modori✨", 0, 100);
        pop();
    }
    //activate glow particle
    if (seeNext && glowActive) {
        drawSimpleGlows();
    }
    //glow clicked display message (used chat as guide and refrence)
    if (clickedGlow !== -1) {
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(24);
        textFont("Comic Sans MS");
        text(glowMessages[clickedGlow], width / 2, height - 50);
    }

    blendMode(BLEND);
}

function mouseClicked() {
    if (progress >= 360 && !seeNext) {
        seeNext = true;
        //activated glow (used youtube and other people's work as refrence)
    } else if (seeNext) {
        let bottleX = width / 2;
        let bottleY = height / 2 + 20;
        let d = dist(mouseX, mouseY, bottleX, bottleY);
        if (d < 20) {
            glowActive = true;
        }
        //chat as guide
        if (glowActive) {
            for (let i = 0; i < glowPositions.length; i++) {
                let g = glowPositions[i];
                if (glowClicked[i]) continue; // already clicked
                let d = dist(mouseX, mouseY, g.x, g.y);
                if (d < g.r + 5) {
                    clickedGlow = i;
                    glowClicked[i] = true; // mark as clicked
                    break;
                }
            }
        }
    }
}
//used star refrence p5js
function drawStar(x, y, radius1, radius2, npoints) {
    beginShape();
    let angle = 360 / npoints;
    let halfAngle = angle / 2;
    for (let a = 0; a < 360; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawModori() {  //draws modori
    //body
    fill(150, 220, 240, 200);
    ellipse(0, 0, 130, 150);

    //feet
    fill(70, 150, 200, 200);
    ellipse(-20, 50, 20, 10);
    ellipse(20, 50, 20, 10);

    // Arms 
    ellipse(-35, 10, 15, 30);
    ellipse(35, 10, 15, 30);

    //eyes
    fill(50);
    ellipse(-15, -10, 8, 8);
    ellipse(15, -10, 8, 8);

    //mouth
    noFill();
    stroke(50);
    strokeWeight(2);
    arc(0, 0, 30, 20, 20, 160);
    noStroke();

    //glowing bottle, refrence used
    if (glowActive) {
        let glowAlpha = 150 + 50 * sin(frameCount * 2);
        fill(255, 230, 150, glowAlpha);
        ellipse(0, 20, 30, 40);
    }
    //bottle
    fill(255, 240, 200);
    rectMode(CENTER);
    rect(0, 20, 20, 30, 5);
}

function drawSimpleGlows() { //draws glow
    noStroke();
    fill(255, 240, 150, 150 + 50 * sin(frameCount * 2));

    glowPositions = [];
    //ai suggested this format for glow
    let positions = [
        [width / 2 + 120 * sin(frameCount * 0.02), height / 2 + 140 * cos(frameCount * 0.01)],
        [width / 2 + 120 * sin(frameCount * 0.015), height / 2 + 160 * sin(frameCount * 0.018)],
        [width / 2 + 120 * sin(frameCount * 0.012), height / 2 - 110 * cos(frameCount * 0.02)],
        [width / 2 + 120 * sin(frameCount * 0.01), height / 2 - 130 * cos(frameCount * 0.015)],
        [width / 2 + 110 * sin(frameCount * 0.017), height / 2 + 110 * cos(frameCount * 0.02)],
        [width / 2 - 120 * cos(frameCount * 0.013), height / 2 + 100 * sin(frameCount * 0.014)],
        [width / 2 + 130 * cos(frameCount * 0.019), height / 2 - 120 * sin(frameCount * 0.01)]
    ];

    for (let i = 0; i < positions.length; i++) {
        let [gx, gy] = positions[i];
        let d = random(8, 15);
        if (!glowClicked[i]) {
            ellipse(gx, gy, d);
        }
        glowPositions.push({ x: gx, y: gy, r: d / 2 });
    }
}
