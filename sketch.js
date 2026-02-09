/*
Week 4 — Example 5: Example 5: Blob Platformer (JSON + Classes)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

This file orchestrates everything:
- load JSON in preload()
- create WorldLevel from JSON
- create BlobPlayer
- update + draw each frame
- handle input events (jump, optional next level)

This matches the structure of the original blob sketch from Week 2 but moves
details into classes.
*/

let data; // raw JSON data
let levelIndex = 0;

let world; // WorldLevel instance (current level)
let player; // BlobPlayer instance

let platforms = [
  new Platform({ x: 0, y: 324, w: 640, h: 36 }),
  new Platform({ x: 120, y: 254, w: 120, h: 12 }),
  new Platform({ x: 300, y: 204, w: 90, h: 12 }),
  new Platform({ x: 440, y: 144, w: 130, h: 12 }),
  new Platform({ x: 300, y: 70, w: 90, h: 12, nextLevel: "Hell Escalator" }), // triggers next level
];

function preload() {
  // Load the level data from disk before setup runs.
  data = loadJSON("levels.json");
}

function setup() {
  // Create the player once (it will be respawned per level).
  player = new BlobPlayer();

  // Load the first level.
  loadLevel(0);

  // Simple shared style setup.
  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  // 1) Draw the world (background + platforms)
  world.drawWorld();

  // 2) Update and draw the player on top of the world
  player.update(world.platforms);
  player.draw(world.theme.blob);

  // 3) HUD
  fill(0);
  text(world.name, 10, 18);
  text("Move: A/D or ←/→ • Jump: Space/W/↑ • Next: N", 10, 36);
}

function keyPressed() {
  // Jump keys
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }

  // Optional: cycle levels with N (as with the earlier examples)
  if (key === "n" || key === "N") {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }
}

/*
Load a level by index:
- create a WorldLevel instance from JSON
- resize canvas based on inferred geometry
- spawn player using level start + physics
*/
function loadLevel(i) {
  levelIndex = i;

  // Create the world object from the JSON level object.
  world = new WorldLevel(data.levels[levelIndex]);

  // Fit canvas to world geometry (or defaults if needed).
  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  // Apply level settings + respawn.
  player.spawnFromLevel(world);
}

function loadLevelByName(name) {
  const i = data.levels.findIndex((l) => l.name === name);
  if (i >= 0) loadLevel(i);
}
