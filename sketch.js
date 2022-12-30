var canvas;
var backgroundImage, car1_img, car2_img, track;
var fuelImage, powerCoinImage, lifeImage;
var obstacle1Image, obstacle2Image;                        //C41// AA
var database, gameState;
var form, player, playerCount;
var allPlayers, fuels, powerCoins, plataCoinsImage, cobreCoinsImage, obstacle1,obstacle2, plataCoins, cobreCoins; // C41//AA
var cars = [];

var blastImage;
var car1,car1_abajoImg, car1_derechaImg,  car1_izquierdaImg;   
var car2,car2_abajoImg, car2_derechaImg,  car2_izquierdaImg;                      //C42// AA
var balaImg;
var bulletGroup;

function preload() {
  //fondos
  backgroundImage = loadImage("assets/background.png");
  track = loadImage("assets/track.jpg");

  //CARRO1
  car1_img = loadImage("assets/car1.png");
  car1_abajoImg =loadImage("assets/car1_abajo.png");
  car1_derechaImg = loadImage("assets/car1_derecha.png");
  car1_izquierdaImg = loadImage("assets/car1_izquierda.png");

  //CARRO2
  car2_img = loadImage("assets/car2.png");
  car2_abajoImg =loadImage("assets/car2_abajo.png");
  car2_derechaImg = loadImage("assets/car2_derecha.png");
  car2_izquierdaImg = loadImage("assets/car2_izquierda.png");

  //imagenes monedas
  powerCoinImage = loadImage("assets/goldCoin.png");
  plataCoinsImage = loadImage("assets/plataCoin.png");
  cobreCoinsImage = loadImage("assets/cobreCoin.png");
  //vida y gasolina
  fuelImage = loadImage("assets/fuel.png");
  lifeImage = loadImage("assets/life.png");
  //obstaculos
  obstacle1Image = loadImage("assets/obstacle1.png"); // C41//AA
  obstacle2Image = loadImage("assets/obstacle2.png"); // C41//AA
  //explosión
  blastImage = loadImage("assets/blast.png"); //C42 //AA
  //bala
  balaImg = loadImage("assets/bala.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 2) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }

  if (gameState === 2) {
    game.showLeaderboard();
    game.end();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
