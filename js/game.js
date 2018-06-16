/**
 * Game class
 * The game composer. Game is configured from or through this class.
 */
class Game {
  constructor ({status = false}) { // default status value is false
    this.status = status; // FUTURE USE
    this.score = 0; // Keeps track of game score
    this.enemiesKilled = 0; // Keeps track of enemies killed
  }

  /**
   * Static -> Game.createCanvas() - creates a canvas with 510x606
   */
  static createCanvas () {
    // create canvas with height and width
    if (window.engine) { // check if variable is accessible
      engine.createCanvas({
        height: 606,
        width: 510
      });
    }
  }

  /**
   * Static -> Game.startEngine -> starts the game engine
   */
  static startEngine () {
    // initialize the engine with initial game level
    if (window.engine) {
      engine.init({
        images:
          "images/map/level_one.jpg" // path -> background image
      });
    }
  }

  /**
   * Static -> Game.addPlayer -> adds player
   * @param x
   * @param y
   */
  static addPlayer ({x, y}) {
    const commonProps = {
      width: 192,
      columns: 4
    };

    // globally accessible player variable
    window.player = new Player({
      sprite: "images/player/p-idle.png", // the starting sprite for character to load
      actions: { // all player actions - this controls what the sprites will load.
        idle: { // player idle
          source: "images/player/p-idle.png",
          ...commonProps
        },
        left: { // player moving left
          source: "images/player/p-left.png",
          ...commonProps
        },
        right: { // player moving right
          source: "images/player/p-right.png",
          ...commonProps
        },
        down: { // player moving doown
          source: "images/player/p-down.png",
          ...commonProps
        },
        up: { // player moving up
          source: "images/player/p-up.png",
          ...commonProps
        },
        attackLeft: { // player attacking left side
          source: "images/player/p-attack-left.png",
          ...commonProps
        },
        attackRight: { // player attacking right side
          source: "images/player/p-attack-right.png",
          ...commonProps
        },
        attackUp: { // player attacking up
          source: "images/player/p-attack-up.png",
          ...commonProps
        },
        attackDown: { // player attacking down
          source: "images/player/p-attack-down.png",
          ...commonProps
        },
        hitLeft: { // player hit left
          source: "images/player/p-hit-left.png",
          ...commonProps
        },
        hitRight: { // player hit from right
          source: "images/player/p-hit-right.png",
          ...commonProps
        },
        hitUp: { // player hit from above
          source: "images/player/p-hit-up.png",
          ...commonProps
        },
        hitDown: { // player hit from below
          source: "images/player/p-hit-down.png",
          ...commonProps
        }
      },
      x: x, // window.canvas.width / 2 - 20 -> starting position for player
      y: y, // window.canvas.height - 100 -> starting position for player
      speed: 85, // starting speed for player
      spriteWidth: 192, // sprite sheet width
      spriteHeight: 48, // sprite sheet height
      columns: 4, // number of frames
      direction: false, // initial direction set to false
      controllable: true, // entity is controllable
      frameCount: 4 // frame count
    });

    // initialize the player
    player.init();
  }

  /**
   * Adds a [random] number of enemies, colors, speeds, direction.
   */
  static addEnemies () {
    let allEnemies, // all enemies will be sent here
      variants = ["blue", "red", "green"], // set color variants
      enemyPositions = [140, 230, 320], // set Y coordinates where slime can be spawned - aligned to gates
      enemyStart = []; // this will hold the dynamically generated x coordinates for our enemies to spawn at

    /**
     * Loop through a randomly generated number between 20-35.
     * This will create that number of enemies.
     */
    for (let i = 0; i < (Math.floor(Math.random() * (35 - 20 + 1) + 20)); i++) {
      if (window.canvas) { // check if canvas is accessible
        const position = Math.floor(Math.random() * (150 - 50 + 1)) + 50; // random number between 150 and 50 for enemy's X coordinate

        // if current iteration is an even number (could use any method really)
        if (i % 2 === 0) {
          enemyStart.push(window.canvas.width + position); // the enemy will spawn on the right side of the canvas (positive number)
        } else {
          enemyStart.push(position * -1); // the enemy will spawn on the left side of the canvas (negative number)
        }
      }
    }

    /**
     * Creates a new array within allEnemies variable.
     * This array will be filled with enemy objects.
     * @type {Enemy[]}
     */
    allEnemies = enemyStart.map(enemyX => {
      // Note: This could be merged with previous for loop, but I wanted to try the .map function.
      const color = variants[Math.floor(Math.random() * variants.length)], // get a random color from the variants variable
        direction = enemyX > 0 ? "left" : "right", // check if enemy's X coordinate is positive or negative
        commonProps = { // props shared among all enemies within their actions
          width: 192, // sprite width
          columns: 4 // number of columns (frames)
        };

      /**
       * Returns an Enemy object with the properties passed in.
       */
      return new Enemy({
        sprite: "images/enemy/slime-" + color + "-" + direction + ".png", // will return path like images/enemy/slime-red-left.png
        x: enemyX, // pass in the enemy's X coordinate
        y: enemyPositions[Math.floor(Math.random() * enemyPositions.length)], // get a random Y position from allowed spawn coordinates [enemyPositions]
        spriteWidth: 192,
        spriteHeight: 48,
        direction: enemyX > 0 ? 3 : 1, // if not a negative number, enemy will run left, otherwise, right
        frameCount: 4, // number of frames
        currentFrame: Math.floor(Math.random() * 4), // random frame so that enemies have different animation start point, looks a bit less robotic.
        columns: 4,
        rows: 1,
        speed: 100 + Math.floor(Math.random() * 150), // random speed value given to enemy
        actions: {
          left: {
            source: "images/enemy/slime-" + color + "-left.png",
            ...commonProps
          },
          right: {
            source: "images/enemy/slime-" + color + "-right.png",
            ...commonProps
          },
          up: {
            source: "images/enemy/slime-" + color + "-up.png",
            ...commonProps
          },
          down: {
            source: "images/enemy/slime-" + color + "-down.png",
            ...commonProps
          },
          idle: {
            source: "images/enemy/slime-" + color + "-idle.png",
            ...commonProps
          },
          hitDown: {
            source: "images/enemy/slime-" + color + "-hit-down.png",
            ...commonProps
          },
          hitUp: {
            source: "images/enemy/slime-" + color + "-hit-up.png",
            ...commonProps
          },
          hitLeft: {
            source: "images/enemy/slime-" + color + "-hit-left.png",
            ...commonProps
          },
          hitRight: {
            source: "images/enemy/slime-" + color + "-hit-right.png",
            ...commonProps
          },
          attackDown: {
            source: "images/enemy/slime-" + color + "-attack-down.png",
            ...commonProps
          },
          attackUp: {
            source: "images/enemy/slime-" + color + "-attack-up.png",
            ...commonProps
          },
          attackLeft: {
            source: "images/enemy/slime-" + color + "-attack-left.png",
            ...commonProps
          },
          attackRight: {
            source: "images/enemy/slime-" + color + "-attack-right.png",
            ...commonProps
          }

        }
      });
    });

    // Now that all enemy objects are created.
    // Iterated through each one and initialize them.
    allEnemies.forEach(enemy => enemy.init());

    // Make allEnemies globally accessible
    window.allEnemies = allEnemies;
  }

  /**
   * Generates all props that are animated or have special effects
   */
  static addProps () {
    let allProps, // all props will end up here and made globally accessible
      props = [
        {
          x: 185, // x coordinate
          y: 430, // y coordinate
          sprite: "images/assets/torch.png", // path to sprite image
          row: 1, // number of rows on sprite sheet
          columns: 4, // number of columns on sprite sheet
          frameCount: 4, // number of frames
          spriteWidth: 96, // sprite sheet width
          spriteHeight: 24 // sprite sheet height
        },
        {
          x: 300, // x coordinate
          y: 430, // y coordinate
          sprite: "images/assets/torch.png", // path to sprite image
          row: 1, // number of rows on sprite sheet
          columns: 4, // number of columns on sprite sheet
          frameCount: 4, // number of frames
          spriteWidth: 96, // sprite sheet width
          spriteHeight: 24 // sprite sheet height
        },
        {
          x: 204, // x coordinate
          y: 0, // y coordinate
          sprite: "images/assets/level_one_gate.jpg", // path to sprite image
          row: 1, // number of rows on sprite sheet
          columns: 1, // number of columns on sprite sheet
          frameCount: 1, // not animated, so 1
          spriteWidth: 97, // sprite sheet width
          entityID: "gate", // entity ID key
          spriteHeight: 26 // sprite sheet height
        },
        {
          x: 235, // x coordinate
          y: 31, // y coordinate
          sprite: "images/assets/gate-key.png", // path to sprite image
          row: 1, // number of rows
          columns: 4, // number of columns on sprite sheet
          frameCount: 4, // number of frames - this is animated
          spriteWidth: 192, // sprite sheet width
          entityID: "gatekey", // entity ID key
          spriteHeight: 48, // sprite sheet height
          callback: function () {
            // Callback function that fires when player picks up / touches item
            // check if all enemies are dead and if screens, allProps and sounds variables are accessible
            if (allEnemies.length === 0 && window.screens && window.allProps && window.sounds) {
              const gate = allProps.find((e) => e.entityID === "gate");
              this.special = false; // one time use object - set special to false
              window.sounds.pickUp.playSound(); // play the item pickup sound
              this.remove(); // remove this item from canvas

              if (gate) { // if gate is found

                for (let a = 0; a < 5; a++) { // loop for animation
                  setTimeout(() => gate.y -= 5, 500 * a); // will move the gate up -5px per 500ms

                  if (a === 4) { // once we reach the 5th iteration
                    player.controllable = false; // disallow user from moving player

                    for (let t = 0; t < 15; t++) { // loop for a second animation

                      //Animate the player moving out of the map and in to the gate
                      // Note: Trying out the comma operator here.
                      // Resource: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comma_Operator
                      setTimeout(() => (player.newSprite("up"), player.y -= 15), 250 * t);

                      if (t === 14 && window.screens && window.sounds) { // if on 15th iteration
                        window.sounds.gamePlay.stop(); // stop the game play music
                        window.sounds.win.playSound(); // start the win screen music
                        screens.win.status = true; // set status of screen to true
                        screens.win.initEnd({ // initialize the win screen
                          message: "You Win!" // set the message
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ];

    // loop a random number of times between 1-8 - to spawn HP pots.
    for (let i = 0; i < (Math.floor(Math.random() * (8 - 1 + 1) + 1)); i++) {
      props.push({
        x: 35 * (Math.floor(Math.random() * (11 - 1 + 1) + 1)), // random x coordinate 35 * 1-11 (35-385)
        y: 71 * (Math.floor(Math.random() * (5 - 1 + 1) + 1)), // random y coordinate 71 * 1-5 (71-355)
        sprite: "images/assets/hp-potion.png", // path to resource
        row: 1, // number of rows
        columns: 4, // columns
        currentFrame: (Math.floor(Math.random() * 5)), // start frame for animation - random so they look less uniform
        frameCount: 4, // frames (animated - looks like it hovers)
        spriteWidth: 192, // sprite image width
        spriteHeight: 48, // sprite image height
        callback: function () { // arrow function has no power here
          player.hp >= 75 ? player.hp = 100 : player.hp += 25; // if hp greater than 75, just max it, else +25 to HP
          this.special = false; // set item's special to false
          window.sounds.pickUp.playSound(); // play the sound of picking up an item
          this.remove(); // remove this item
        }
      });
    }

    allProps = props.map(prop => new Prop(prop)); // map props to allProps -> creating new Prop objects.
    allProps.forEach(prop => prop.init()); // initialize each prop in array

    window.allProps = allProps; // make all props variable globally accessible
  }

  /**
   * Adds a global variable with all sounds.
   * You can then access these sounds and play them -> sounds.intro.playSound();
   */
  static addSounds () {
    // will not start playing if user hasn't interacted with the site before
    if (window.location.href.indexOf("?ready") === -1) {
      window.location.href = window.location.href + "?ready=true";
    }

    window.sounds = {}; // globally accessible variable

    // Could have used an object, would have been cleaner. Wanted to try out using Maps.
    let soundEffects = new Map();

    soundEffects.set("intro", "audio/intro.mp3");
    soundEffects.set("win", "audio/win.mp3");
    soundEffects.set("gamePlay", "audio/gameplay.mp3");
    soundEffects.set("gameOver", "audio/gameover.mp3");
    soundEffects.set("enemyHit", "audio/enemyHit.wav");
    soundEffects.set("playerHit", "audio/playerHit.wav");
    soundEffects.set("pickUp", "audio/pickup.wav");
    soundEffects.set("select", "audio/select.wav");

    if (window.sounds) { // if accessible
      for (let [key, value] of soundEffects.entries()) { // iterate through each resource
        let sound = new Sound(value); // new Sound object with resource passed in
        sound.init(); // initialize the new sound
        window.sounds[key] = sound; // add new sound to the sounds array, with appropriate key as an object.
      }
    }
  }

  /**
   * Resets the game.
   */
  static reset() {
    if (window.engine){
      engine.renderingQueue = [];
      Game.init();
    }
  }

  /**
   * Renders score on screen
   */
  renderScore () {
    const score = this.score > 0 ? "0" + this.score : "0000"; // if score is greater than , add 1 leading zero, otherwise, score is "0000"
    if (window.ctx) { // check if ctx is accessible
      window.ctx.font = "20px VT323"; // change font size and family
      window.ctx.fillStyle = "#FFFFFF"; // set color
      window.ctx.fillText("Score: " + score, 70, 60); // render score
    }
  }

  /**
   * Initialize Game instance
   */
  static init () {
    Game.startEngine(); // initializes game engine
    Game.addProps(); // adds props to game
    Game.addEnemies(); // adds enemies to the  game
    Game.addPlayer({ // adds player to game
      x: window.canvas.width / 2 - 20,
      y: window.canvas.height - 100
    });
  }
}

/**
 * Create new Game object.
 * Make it globally accessible.
 * @type {Game}
 */
window.game = new Game({
  status: true // set initial game status
});

