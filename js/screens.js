/**
 * Screen class for creating screens within game.
 * Heavily dependent on accessing canvas and ctx variables.
 */
class Screen {
  constructor ({x = 0, y = 0, background = "#000000", width, height}) {
    this.background = background;
    this.images = new Map();
    this.width = width;
    this.sound = null; // take a callback function with sound to play.
    this.height = height;
    this.status = true;
    this.y = y;
    this.x = x;
  }
}

/**
 * Intro screen class
 * Handles logic for intro screen
 */
class Intro extends Screen {
  constructor (...props) {
    super(...props);
    this.blink = false; // blink flag for cta (call to action)
  }

  /**
   * Add background to intro screen.
   */
  addBackground () {
    if (window.canvas && window.ctx) { // check if canvas and ctx variable are accessible
      const slimeBG = new Image(); // create a new image object
      slimeBG.src = "images/screen/slime.png"; // assign source to new image object
      this.background = slimeBG; // set background to new image object
    }
  }

  /**
   * Render screen background
   */
  renderBackground () {
    if (window.canvas && window.ctx) { // check if variables are accessible
      ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
      ctx.drawImage(this.background, 0, (this.y * -1)); // draw the background (off canvas)
    }
  }

  /**
   * Handles the background animation
   */
  animateBackground () {
    setTimeout(() => { // sets a timeout
      if ((this.y * -1) < 0) { // if the current screen Y is less than zero (once this.y reaches negative numbers * -1 will make this false)
        this.renderBackground(); // render background
        this.y -= 35; // update screen Y
        this.animateBackground(); // call self
      } else {
        this.ready(); // background is loaded, allow player to start the game.
      }
    }, 100); // fire every 100ms
  }

  /**
   * Handles logic of screen once the background animation has passed.
   */
  ready () {
    this.addText(); // add text to screen
    this.startGame(() => { // pass a callback function to be fired by user input
      this.status = false; // set status of screen to false
      Game.init(); // initialize the Game
      if (window.sounds) { // check if accessible
        window.sounds.intro.stop(); // stop the intro background music
        window.sounds.select.playSound(); // play the menu select sound
        window.sounds.gamePlay.playSound(); // play the game play background music
      }
    });
  }

  /**
   * Set screens title
   */
  setTitle () {
    if (window.canvas && window.ctx) { // if variables are accessible
      ctx.font = "30px headliner"; // set font size and font family
      ctx.textAlign = "center"; // set alignment
      ctx.fillStyle = "#FFFFFF"; // set color
      ctx.fillText("James in the", 255, window.canvas.height / 2); // first line of text
      ctx.fillText("Dungeon of Slime", 255, window.canvas.height / 2 + 25); // second line of text
    }
  }

  /**
   * Set the call to action.
   */
  setCTA () {
    if (window.canvas && window.ctx) { // if variables are accessible
      setTimeout(() => { // set a timeout function
        ctx.clearRect(0, window.canvas.height / 2 + 55, window.canvas.width, 30); // clear area within this rectangle

        ctx.beginPath(); // begin path
        ctx.rect(0, window.canvas.height / 2 + 55, window.canvas.width, 30); // draw a rectangle
        ctx.fillStyle = "#000000"; // set fill color
        ctx.fill();

        ctx.font = "12px headliner"; // set font
        ctx.fillStyle = this.blink ? "#000000" : "#FFFFFF"; // set color based on blink status
        this.blink = !this.blink; // make current status true m
        ctx.textAlign = "center"; // center text
        ctx.fillText("Press enter to start", 255, window.canvas.height / 2 + 75); // render text

        this.setCTA(); // call self
      }, 450); // fires every 450ms
    }
  }

  /**
   * Set copyright text
   */
  setCopyright () {
    if (window.canvas && window.ctx) { // check if canvas and ctx are accessible
      ctx.font = "12px headliner"; // set font size and family
      ctx.textAlign = "center"; // align text
      ctx.fillStyle = "#FFFFFF"; // set text color
      ctx.fillText("© lloan alas.", 255, window.canvas.height - 50); // render text
    }
  }

  /**
   * Fires all text rendering functions
   */
  addText () {
    this.setTitle(); // sets title
    this.setCTA(); // sets the call-to-action
    this.setCopyright(); //
  }

  /**
   * Activates an event listener.
   * Fired when intro scree animation ends.
   * @param cb
   */
  startGame (cb) {

    document.addEventListener("keydown", e => {
      if (this.status) { // if status is true
        let k = e.keyCode ? e.keyCode : e.which; // get key character code

        if (k === 13) { // if user pressed enter
          cb(); // fire the callback function
        }

      }
    });
  }

  /**
   * Initialize this screen.
   * Adds the background and animates it.
   */
  init () {
    this.addBackground();
    this.animateBackground();
  }
}

/**
 * End class is for screens that end the game - win, lose, etc.
 */
class End extends Screen {
  constructor (...props) {
    super(...props);
  }

  /**
   * Set screen background
   */
  setBackground () {
    if (window.ctx) { // check if ctx is accessible
      ctx.beginPath(); // begin path
      ctx.fillStyle = this.background; // set fill
      ctx.fill(); // fill shape
      ctx.rect(this.x, this.y, this.width, this.height); // render shape
    }
  }

  /**
   * Set screen message
   * @param message
   */
  setMessage (message) {
    if (window.canvas && window.ctx) { // check if canvas and ctx are accessible
      ctx.font = "30px headliner"; // set font size and family
      ctx.textAlign = "center"; // align text
      ctx.fillStyle = "#FFFFFF"; // set color
      ctx.fillText(message, 255, this.y + 100); // render text

      ctx.font = "20px headliner"; // change font size and family
      ctx.fillText("Score: " + game.score, 255, this.y + 130); // render new text

      ctx.font = "14px headliner"; // change font size and family
      ctx.fillText("X  " + game.enemiesKilled, window.canvas.width / 2 + 30, this.y + 180); // render new text

      ctx.font = "14px headliner"; // change font size and family
      ctx.fillText("Thank You for Playing!", 255, this.y + 240); // render new text
    }
  }

  /**
   * Adds an image to the screen of enemies killed
   */
  addEnemies () {
    if (window.canvas && window.ctx) { // check if canvas and ctx are accessible
      const enemies = new Image(); // create new image object
      enemies.src = "images/screen/enemy.png"; // set source of image object
      this.images.set("enemies", enemies) // image added to images map
    }
  }

  /**
   * Renders enemy image to screen
   */
  renderEnemies () {
    if (window.canvas && window.ctx) { // check if canvas and ctx are accessible
      ctx.drawImage(this.images.get("enemies"), window.canvas.width / 2 - 50, this.y + 160); // render image
    }
  }

  /**
   * Initialize the screen with a message as a parameter.
   * @param message
   */
  initEnd ({message}) {
    if (window.engine && window.allEnemies) { // if engine and allEnemies variables are set
      engine.renderingQueue.push(() => { // add this function to the rendering queue
        this.setBackground(); // set background
        this.setMessage(message); // set message
        this.addEnemies(); // add enemies (for screen - not game)
        this.renderEnemies(); // render enemies (for screen - not game)
      });
    }
  }
}

