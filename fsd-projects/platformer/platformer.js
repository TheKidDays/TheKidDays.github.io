$(function () {
  // initialize canvas and context when able to
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("load", loadJson);

  function setup() {
    if (firstTimeSetup) {
      halleImage = document.getElementById("player");
      projectileImage = document.getElementById("projectile");
      cannonImage = document.getElementById("cannon");
      $(document).on("keydown", handleKeyDown);
      $(document).on("keyup", handleKeyUp);
      firstTimeSetup = false;
      //start game
      setInterval(main, 1000 / frameRate);
    }

    // Create walls - do not delete or modify this code
    createPlatform(-50, -50, canvas.width + 100, 50); // top wall
    createPlatform(-50, canvas.height - 10, canvas.width + 100, 200, "navy"); // bottom wall
    createPlatform(-50, -50, 50, canvas.height + 500); // left wall
    createPlatform(canvas.width, -50, 50, canvas.height + 100); // right wall

    //////////////////////////////////
    // ONLY CHANGE BELOW THIS POINT //
    //////////////////////////////////

    // TODO 1 - Enable the Grid
    toggleGrid();


    // TODO 2 - Create Platforms
    createPlatform(0,700,1400,50,"green")
    createPlatform(300,400,100,30,"red")
    createPlatform(400,400,100,30,"red")
    createPlatform(650,650,100,50,"darkred")
    createJumpPad(900, 670, 100, 30, 20, "darkblue");
    createPlatform(1000,350,100,50,"blue")
    createPlatform(1150,400,100,50,"blue")
    createPlatform(1300,300,100,50,"blue")
    createJumpPad(1150,370,100,30,20,"darkblue")
    createPlatform(600,150,100,50,"blue")
    createPlatform(800,150,200,50,"blue")
    createFakePlatform(700,150,100,50,"blue")
    createFakePlatform(200,300,100,50,"blue")
    createPlatform(100,300,100,50,"blue")
    createPlatform(50,200,100,50,"blue")
    createPlatform(100,450,100,50,"blue")


    // TODO 3 - Create Collectables
    createCollectable("database", 1330, 200,);
    createCollectable("database", 80, 150,);
    createCollectable("database", 130, 400,);

    
    // TODO 4 - Create Cannons
    createSpike(400, 690, 100, 30,"darkred",);
    createSpike(300, 690, 100, 30,"darkred",);
    createSpike(400, 430, 100, 30,"darkred","down");
    createSpike(300, 430, 100, 30,"darkred","down");
    createSpike(650,630,100,30,"darkred")
    createSpike(650,640,100,30,"darkred","left")
    createSpike(650,670,100,30,"darkred","left")
    createSpike(650,640,100,30,"darkred","right")
    createSpike(650,670,100,30,"darkred","right")
    createSpike(900,200,100,30,"darkred","down")
    createCannon("top", 400, 1000, 75, 75)
    createCannon("right",500,1250,75,75)
    createCannon("bottom",1100,1750,75,75)
    createCannon("bottom",1200,1500,75,75)
    createCannon("right",200,2000,75,75)

    
    //////////////////////////////////
    // ONLY CHANGE ABOVE THIS POINT //
    //////////////////////////////////
  }

  registerSetup(setup);
});
