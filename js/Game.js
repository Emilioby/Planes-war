class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false;
    //C41//AA
    this.leftKeyActive = false;
    this.blast = false;
    //carro1
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("arriba", car1_img);
    car1.scale = 0.07;
    car1.addImage("blast", blastImage); //C42 //AA
    car1.addImage("abajo", car1_abajoImg);
    car1.addImage("derecha", car1_derechaImg);
    car1.addImage("izquierda", car1_izquierdaImg);
    //img
    
    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("arriba", car2_img);
    car2.scale = 0.07;
    car2.addImage("blast", blastImage); //C42//AA
    car2.addImage("abajo",car2_abajoImg);
    car2.addImage("derecha", car2_derechaImg);
    car2.addImage("izquierda", car2_izquierdaImg);
    //img
    

    cars = [car1, car2];

    fuels = new Group();
    powerCoins = new Group();
    plataCoins = new Group();
    cobreCoins= new Group();
    bulletGroup = new Group();   

    obstacle1 = new Group(); 
    obstacle2 = new Group(); 
    var obstacle1Positions = [
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
     
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
    ];

    var obstacle2Positions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
     
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    // Añadiendo sprite de combustible en el juego.
    this.addSprites(fuels, 4, fuelImage, 0.02);

    // Añadiendo sprite de moneda en el juego.
    this.addSprites(powerCoins, 18, powerCoinImage, 0.09);

    //sprite de la moneda de plata
    this.addSprites(plataCoins, 18, plataCoinsImage, 0.09 );

    //sprite de la moneda decobre
    this.addSprites(cobreCoins, 18, cobreCoinsImage, 0.09 );

    // Añadiendo sprite de obstáculos en el juego.
    this.addSprites(
      obstacle1,
      obstacle1Positions.length,
      obstacle1Image,
      0.04,
      obstacle1Positions
    );
    this.addSprites(
      obstacle2,
      obstacle2Positions.length,
      obstacle2Image,
      0.04,
      obstacle2Positions
    );
  }

  //C41 //AA
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //AA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
    }
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Reiniciar juego");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Estadísticas");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();
    //fondo 2
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6,);


      this.showFuelBar();
      this.showLife();
      this.showLeaderboard();

      //Índice del arreglo.
      var index = 0;
      for (var plr in allPlayers) {
        //Agrega 1 al índice por cada ciclo.
        index = index + 1;

        //Usa datos de la base de datos para mostrar los autos en dirección x y y
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        var currentlife = allPlayers[plr].life;
       
        

         //animaciones
         if (currentlife <= 0) {
          cars[index - 1].changeImage("blast");
          cars[index - 1].scale = 0.3;
         }

        if(keyDown("space")){
          this.handleshootBullet(index);
        }


        

        
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;
       //circulo jugador
        if (index === player.index) {
          stroke(10);
          fill("cyan");
          ellipse(x, y, 60, 60);

          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handlePlataCoins(index);
          this.handleCobreCoins(index);
          this.handleObstacle1Collision(index);
          this.handleObstacle2Collision(index); //C41//AA
          //this.handleshootBullet(index);
          if(player.life <= 0){
            this.blast = true;
            this.playerMoving = false;
          }

          
  

          // Cambiando la posición de la cámara en dirección y.
          camera.position.y = cars[index - 1].position.y;
          // Cambiando la posición de la cámara en dirección x.
          //camera.position.x = cars[index - 1].position.x;
        }
      }

      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }

      // Manipulando los eventos del teclado.
      this.handlePlayerControls();

      // Línea de meta
      const finshLine = height * 6 - 100;
        // Linea de meta
      /*if (player.positionY > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }*/

      drawSprites();
    }
  }

  handleFuel(index) {
    // Añadiendo combustible
    cars[index - 1].overlap(fuels, function(collector, collected) {
      player.fuel = 185;
       //"collected" es el sprite en el grupo de coleccionables que desencadenaron
      //el evento
      collected.remove();
    });

    // Reduciendo el combustible del auto del jugador.
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3;
    }

    if (player.fuel <= 0) {
      gameState = 2;
      this.gameOver();
    }
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 21;
      player.update();
      //"collected" es el sprite en el grupo de coleccionables que desencadenaron
      //el evento
      collected.remove();
    });
  }

  handlePlataCoins(index) {
    cars[index - 1].overlap(plataCoins, function(collector, collected) {
      player.score += 10;
      player.update();
      //recolectado el sprite en el grupo de recolectables que desencadenan
      //el evento
      collected.remove();
    });
  }
 
  handleCobreCoins(index) {
    cars[index - 1].overlap(cobreCoins, function(collector, collected) {
      player.score += 5;
      player.update();
      //recolectado el sprite en el grupo de recolectables que desencadenan
      //el evento
      collected.remove();
    });
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        carsAtEnd: 0,
        playerCount: 0,
        gameState: 0,
        palyers: {}
      });
      window.location.reload();
    });
  }

  showFuelBar() {
    push();
    image(fuelImage, width / 2 - 130, height - player.positionY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
    noStroke();
    pop();
  }

  showLeaderboard() {
    var leader1,leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Esta etiqueta se utiliza para mostrar cuatro espacios.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  handlePlayerControls() {
    if(!this.blast){
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.leftKeyActive = true;
        player.positionX -= 5;
        player.update();
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 600) {
        this.leftKeyActive = false;
        player.positionX += 5;
        player.update();
      }
    }
   
  }

  //C41 //AA COLISION OBSTACULOS
  handleObstacle1Collision(index) {
    cars[index - 1].overlap(obstacle1, function(collector, collected) {
        player.life += 50;
      player.update();
      //recolectado el sprite en el grupo de recolectables que desencadenan
      //el evento
      collected.remove();
    });
  }

  handleObstacle2Collision(index) {
    if(cars[index-1].collide(obstacle2)){      //C41 //AM
      if (this.leftKeyActive) {
        player.positionX += 100;
      } else {
        player.positionX -= 100;
      }

      //C41 //AA
      //Reduciendo la vida del jugador.
      if (player.life > 0) {
        player.life -= 185 / 6;
      }

      player.update();
      
    }
  }


  //handleshootBullet(index){
  /*bala= createSprite(150, width/2, 50,20);
  bala.y= cars[index - 1].y-20;
  bala.addImage(balaImg);
  bala.scale=0.12;
  bala.velocityX= 7;
  bulletGroup.add(bala);
  }*/

  

  
  showRank() {
    swal({
      title: `¡Impresionante!${"\n"}Puntuación${"\n"}${player.rank}`,
      text: "Llegaste a la línea de meta exitosamente",
      imageUrl:
        "https://cdn.discordapp.com/attachments/970837396465807422/1048087672415076373/image.png",
      imageSize: "200x200",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Fin del juego`,
      text: "¡Ups!¡Perdista la carrera!",
      imageUrl:
        "https://cdn.discordapp.com/attachments/970837396465807422/1044806796449165372/image.png",
      imageSize: "100x100",
      confirmButtonText: "Gracias por jugar"
    });
  }


}
