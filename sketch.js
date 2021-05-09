var bg, backgroundImg, platformImage, platformGroup;
var diamondImage, diamondsGroup;
var spikeImage, spikesGroup;
var score = 0;
var gameState = "PLAY";        /* Varaible Declaration of playing , non-playing characters , sound , score */
var obsSound;
var winSound;
var ironMan;
var dead;
var scoreImage

function preload() {
  backgroundImg = loadImage("images/bg2.jpg");
  ironImage = loadImage("images/iron.png");
  platformImage = loadImage("images/stone.png");
  diamondImage = loadImage("images/diamond.png");
  spikeImage = loadImage("images/spikes.png");             /* Loading of images and sound */
  restartImage = loadImage("images/restart.png");
  obsSound = loadSound("sounds/die.mp3");
  winSound = loadSound("sounds/win.mp3");
  deadImage=loadImage("images/dead3.png")
  scoreImage=loadImage("images/score2.png")
}

function setup() {
  createCanvas(1100, 600);
  // Creating background
  bg = createSprite(580, 300);
  bg.addImage(backgroundImg);
  bg.scale = 1;
  // Cretaing Iron Man
  ironMan = createSprite(500, 505, 20, 50);
  ironMan.addImage("running", ironImage);
  ironMan.scale = 0.3;
  ironMan.setCollider("rectangle", 100, 0, 200, 400)
  // Creating Groups
  platformGroup = new Group();
  diamondsGroup = new Group();
  spikesGroup = new Group();
  // Creating restart button
  restart = createSprite(500, 450);
  restart.addImage(restartImage);
  restart.visible = false;
  // Creating dead images
  dead= createSprite(500,240);
  dead.addImage(deadImage);
  dead.visible=false;
  dead.scale=0.4;
  score=createSprite(450,50);
  score.addImage(scoreImage);
  score.scale=0.4;

}

function draw() {

  if (gameState === "PLAY") {
    if (keyDown("up")) {
      ironMan.velocityY = -5;
    }
    // Controls for mario
    if (keyDown("left")) {
      ironMan.x = ironMan.x - 5;
    }
    if (keyDown("right")) {
      ironMan.x = ironMan.x + 5;
    }
    // Preventing Iron Man from moving out from the top
    if (ironMan.y < 50) {
      ironMan.y = 50;
    }
    // Preventing Iron Man from moving out from the left boundary
    if (ironMan.x<100)
      ironMan.x=100;
    // Preventing Iron Man from moving out from the right boundary
    
      // Gravity for mario
    ironMan.velocityY = ironMan.velocityY + 0.5;
    // Generating platform for Iron Man
    generateBricks();
    for (var i = 0; i < platformGroup.length; i++) {
      var temp = platformGroup.get(i);

      if (temp.isTouching(ironMan)) {
        ironMan.collide(temp);
      }
    }
    //Generating diamonds for Iron Man
    generateDiamonds();

    for (var i = 0; i < (diamondsGroup).length; i++) {
      var temp = (diamondsGroup).get(i);


      if (temp.isTouching(ironMan)) {
        score++; // adding scores
        winSound.play(); // Sound is played when Iron Man collects a diamond
        temp.destroy();
        temp = null;
      }

    }
    // Generating obstacles for Iron Man
    generateSpikes();

    for (var i = 0; i < (spikesGroup).length; i++) {
      var temp = (spikesGroup).get(i);

      if (temp.isTouching(ironMan)) {
        score = score - 5;
        temp.destroy();
        obsSound.play() // Sound is played when mario touches or get obstructed by spikes/bullets
        temp = null;
      }

    }
    if (score <= -10 || ironMan.y > 610) {
      gameState = "END";
      dead.visible = true;
    }

  }
  if (gameState === "END") {
    bg.velocityY = 0;
    ironMan.velocityY = 0;
    diamondsGroup.setVelocityYEach(0);
    spikesGroup.setVelocityYEach(0);
    platformGroup.setVelocityYEach(0);
    diamondsGroup.setLifetimeEach(-1);
    spikesGroup.setLifetimeEach(-1);
    platformGroup.setLifetimeEach(-1);

    restart.visible = true;
    if (mousePressedOver(restart)) {
      restartGame();   // if mouse is pressed over restart image the game restarts
      

    }
  }

  drawSprites();
  textSize(40);
  fill("orange")
  text(/*"Score: "*/+ score, 550, 63);

}
// Controls for stone generation and lifetime
function generateBricks() {
  if (frameCount % 60 === 0) {
    var brick = createSprite(1200, 10, 40, 10);
    brick.x = random(50, 850);
    brick.addImage(platformImage);
    brick.velocityY = 5;
    brick.lifetime = 250;
    platformGroup.add(brick);
  }
}

// Controls for diamond generation and lifetime
function generateDiamonds() {
  if (frameCount % 80 === 0) {
    var diamond = createSprite(1200, 0, 40, 10);

    diamond.addAnimation("diamond", diamondImage);
    diamond.x = random(50, 850);
    diamond.scale = 0.5;
    diamond.velocityY = 3;
    diamond.lifetime = 400;
    diamondsGroup.add(diamond);
  }
}

// Controls for obstacles generation and lifetime
function generateSpikes() {
  if (frameCount % 100 === 0) {
    var spikes = createSprite(1200, 90, 10, 40);
    spikes.addAnimation("spike", spikeImage);
    spikes.x = random(50, 850);
    spikes.scale = 0.5;
    spikes.velocityY = 3;
    spikes.lifetime = 600;
    spikesGroup.add(spikes);
  }
}

function restartGame() {
  gameState = "PLAY";
  platformGroup.destroyEach();
  diamondsGroup.destroyEach();
  spikesGroup.destroyEach();
  score = 0;
  ironMan.y = 50;
  restart.visible = false;
  obsSound.visible = false;
  dead.visible = false;
}