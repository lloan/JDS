/**
 * Engine Class - Runs the whole game.
 */
class Engine {
  constructor () {
    this.status = true; // engine status
    this.canvas = null; // canvas
    this.ctx = null; // canvas context
    this.delta = null; // delta
    this.background = null; // background color
    this.rows = null; // number of rows (background sprite)
    this.cols = null; // number of columns (background sprite)
    this.callbacks = []; // callback functions for when engine is ready.
    this.renderingQueue = []; // items to add to rendering function to be rendered
    this.main = this.main.bind(this);
  }

  /**
   * Creates canvas with size passed in.
   * New canvas & ctx variables are globally accessible.
   * @param size
   */
  createCanvas ({width = 500, height = 400}) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = width; // set canvas width
    this.canvas.height = height; // set canvas height

    window.ctx = this.ctx; // make ctx globally accessible
    window.canvas = this.canvas; // make canvas globally accessible

    document.body.appendChild(window.canvas); // add canvas to the screen

    if (window.canvas && window.ctx) { // if canvas and ctx are accessible
      this.callbacks.forEach(cb => cb()); // fire all callback functions, engine is ready
    }
  }

  /**
   * Function collects callbacks to fire when engine ready.
   * @param cb
   */
  onReady (cb) {
    this.callbacks.push(cb); // push callback function in to callbacks array
  }

  /**
   * Updates and renders on every repaint [loop]
   */
  main () {
    let now = Date.now(),
      dt = (now - this.delta) / 1000.0; // helps with keeping speed consistent

    this.update(dt); // fire update()
    this.render(); // fire render()

    this.delta = now; // update delta

    if (this.status) { // if game status is true
      window.requestAnimationFrame(this.main); // basically tells browser to fire our function at the next repaint
    }
  }

  /**
   * Collection of all items that need to be updated on every repaint
   * @param dt
   */
  update (dt) {
    this.updateEntities(dt); // updates all entities
  }

  /**
   * Updates all entities: enemies, players, etc.
   * @param dt
   */
  updateEntities (dt) {
    /**
     * Updates all enemies.
     */
    if (window.allEnemies && window.ctx) { // if allEnemies variable and ctx variable are accessible
      //Iterate through all enemies and fire their update function passing the current delta
      window.allEnemies.forEach(enemy => enemy.update(dt));
      // Filter allEnemies array and leave only enemies who's status is true
      window.allEnemies = window.allEnemies.filter(enemy => enemy.status !== false);
    }

    /**
     * If player is accessible
     */
    if (window.player) {
      window.player.update(dt); // fire player update function passing in current delta
    }

    /**
     * If allProps variable is accessible
     */
    if (window.allProps) {
      window.allProps.forEach(prop => prop.activate()); // iterate through props and fire their activate function.
    }

  }

  /**
   * Renders all entities: enemies, players, props.
   */
  renderEntities () {
    // renders player entity
    if (window.player && window.player.character && window.ctx) { // check if variables are accessible to avoid errors
      const p = window.player; // for the sake of brevity
      window.ctx.drawImage(p.character, p.sourceX, p.sourceY, p.width, p.height, p.x, p.y, p.width, p.height);

      /**
       * Renders the player's HP bar while changing the color of the bar,
       * Based on percentage of hp left.
       */
      player.hitPoints({
        xOffset: -2, // offset for the bar's x position
        color: (player.hp / player._hp * 100) < 30 ? "red" : // if hp under 30% color bar red
          (player.hp / player._hp * 100) < 60 ? "yellow" : // if hp under 60% color bar yellow
            (player.hp / player._hp * 100) < 70 ? "orange" : "#50C878" // if hp under 70% color bar orange, green otherwise
      });

    }

    // renders all enemy entities
    if (window.allEnemies && window.ctx) { // check if both variables are accessible to avoid errors
      window.allEnemies.forEach((e) => { // iterate through array holding our enemies
        if (e !== null) { // if enemy is not null
          // render the enemy
          window.ctx.drawImage(e.character, e.sourceX, e.sourceY, e.width, e.height, e.x, e.y, e.width, e.height);

          /**
           * Renders the enemy's HP bar - color doesn't change.
           */
          e.hitPoints({
            relativity: 4,
            weight: 2,
            xOffset: 15
          });
        }
      });
    }

    // Renders all prop entities
    if (window.allProps && window.ctx) { // check if both variables are accessible to avoid errors
      window.allProps.forEach((prop) => { // iterate through array holding our props and render them
        window.ctx.drawImage(prop.character, prop.sourceX, prop.sourceY, prop.width, prop.height, prop.x, prop.y, prop.width, prop.height);
      });
    }
  }

  /**
   * Main render function.
   */
  render () {
    if (window.ctx && window.canvas) { // if ctx and canvas are accessible
      window.ctx.clearRect(0, 0, window.canvas.width, window.canvas.height); // clear canvas
    }

    /**
     * Iterate through each row and column of the background sprite sheet.
     * In our case, its a simple 1 row, 1 column background, nothing special.
     * Will check if passed in background is an array and handle it.
     */
    if (window.ctx && resources) {
      if (Array.isArray(this.background)) { // check if background passed in is an array
        for (let row = 0; row < this.rows; row++) { // iterate through rows
          for (let col = 0; col < this.cols; col++) { // iterate through columns (if multi-dimensional array)
            window.ctx.drawImage(resources.get(this.background[row]), col * 101, row * 83); // render each part of BG
          }
        }
      } else { // BG passed in is not an array
        // render background
        window.ctx.drawImage(resources.get(this.background), 0, 0, canvas.width, canvas.height);
      }
    }

    this.renderEntities(); // called here as parent function will be called in main()
    this.renderQueue(); // render items in the rendering queue

    if (window.game) { // check if variable is accessible
      window.game.renderScore(); // render score
    }
  }

  /**
   * Renders items in the rendering queue
   */
  renderQueue () {
    this.renderingQueue.forEach(r => r());
  }

  /**
   * Initialize game engine
   * @param game
   */
  init (game) {
    const {images, rows = 1, cols = 1} = game; // destructure props
    this.background = images; // set background (can be an array)
    this.rows = rows; // number of rows to look for
    this.cols = cols; // number of columns to expect
    this.delta = Date.now(); // current dt
    this.main(); // fire the game loop
  }
}

/**
 * Creates the game engine we will reference throughout the game.
 * Globally accessible in browser.
 * @type {Engine}
 */
window.engine = new Engine();

/**
 * When engine is ready, create the new screens.
 */
engine.onReady(() => {
  window.screens = {}; // globally accessible variable that will hold our screens

  /**
   * Our intro screen. Will show up when player starts our game.
   * @type {Intro}
   */
  window.screens.intro = new Intro({
    width: window.canvas.width,
    height: window.canvas.height,
    y: 800
  });

  /**
   * Our win screen. Will show up when player wins the game.
   * @type {End}
   */
  window.screens.win = new End({
    background: "#000000",
    width: window.canvas.width - 20,
    height: window.canvas.height / 2,
    y: 100,
    x: 10
  });

  /**
   * Our lose screen. Will show up when player loses the game.
   * @type {End}
   */
  window.screens.lose = new End({
    background: "#850402",
    width: window.canvas.width - 20,
    height: window.canvas.height / 2,
    y: 100,
    x: 10
  });
});
