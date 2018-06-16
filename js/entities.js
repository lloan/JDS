/**
 * Entity Class
 * Parent class of all characters and props in game.
 */
class Entity {
  constructor ({x = 0, y = 0, speed = 0, sprite, actions, spriteWidth, spriteHeight, entityID, controllable = false, columns = 1, rows = 1, direction = false, frameCount = 1, currentFrame = 0, interval = 200, hp = 100, callback = null}) {
    this.x = x; // x coordinate
    this.y = y; // y coordinate
    this.controllable = controllable;
    this.action = actions; // pass in array of objects as actions to change character sprite quickly
    this.callback = callback; // function to be fired upon calling this callback - many potential uses.
    this.character = new Image(); // new image element
    this.currentFrame = currentFrame; // current frame
    this.direction = direction; // direction entity is facing: 1: right, 2: down, 3: left, 4: up
    this.frameCount = frameCount; // frame count - animation
    this.height = spriteHeight / rows; // if using sprite image with multiple rows
    this.width = spriteWidth / columns; // entity width, using sprite width / number of columns
    this.interval = interval; // interval at which entity is updated
    this.loop = null; // main loop for entity animation
    this.previousDirection = false; // last direction entity faced
    this.sourceX = 0; // source x coordinate
    this.sourceY = 0; // source y coordinate
    this.speed = speed; // if entity moves, this is the normal speed
    this.sprite = sprite; // sprite image passed in as a path
    this.status = true; // character status
    this.trackDown = 0; // track for use by sourceY
    this.trackLeft = 0; // track for use by sourceX
    this.trackRight = 0; // track for use by sourceX
    this.trackUp = 0; // track for use by sourceY
    this.entityID = entityID;
    this.hp = hp; // entity hit points (life) - default: 100
    this._hp = () => {
      return hp; // private property - return current hp of entity
    };
    this._run = () => {
      return speed + 80; // private property - if entity moves, this is the run speed
    };
    this._walk = () => { // private property - if entity moves, this is the walk/normal speed
      return speed;
    };
    this.render = this.render.bind(this); //
    this.init = this.init.bind(this); //
    this.updateFrame = this.updateFrame.bind(this);
  }

  static withinProximity (ax, ay, aw, ah, bx, by, bw, bh) {
    /**
     * Proximity variable: Math.abs returns the absolute value of a number.
     * Basically checks the center of both enemy and player coordinates.
     * Looks at both sides of those points, using the width of the entity.
     */
    return (Math.abs(ax - bx) * 2 < aw + bw) && (Math.abs(ay - by) * 2 < ah + bh);

    /**
     * Example Player = 30 (x), 30 (y), 48 (width), 48 (height). Enemy  90, 40, 48, 48
     * X axis:: (30 - 90) * 2 =  |-120| < 48 + 48 (96) = false, not within proximity on x axis.
     * Y axis:: (30 - 40) * 2 = |-20| < 48 + 48 (96) = true, within proximity on Y axis.
     * X (false) & Y (true) = function returns false as both X and Y must return true
     */
  }

  /**
   * Updates source x coordinate for sprite animation purposes
   * Pretty simple as I'm only using single row sprite sheets
   */
  updateFrame () {
    this.currentFrame = ++this.currentFrame % this.frameCount; // returns 0-3
    this.sourceX = this.currentFrame * this.width; // updates the sourceX for sprite animation purposes
  };

  /**
   * Renders this entity on to the canvas - doesn't handle the individual animation.
   * updateFrame() handles updating the frame, to provide the 'animation'.
   */
  render () {
    this.updateFrame();
    window.ctx.drawImage(this.character, this.sourceX, this.sourceY, this.width, this.height, this.x, this.y, this.width, this.height);
  };

  /**
   * Initialization - set the initial sprite for entity and start the loop
   * The entity loop is what provides us the animation - it will call render, which updates our frame,
   * which afterwards renders our updated sprite on to the canvas, making it look like its animated.
   * Keeps the animation and rendering the actual entity separate. Instances of this class can have their own render/update
   * function. Goal is to use this class even for props so I don't have to rewrite the animation loop.
   */
  init () {
    this.character.src = this.sprite;
    this.loop = setInterval(this.render, this.interval); // It's what keeps our entity animated
  };

  /**
   * Remove entity from board - could be refactored to use a better method.
   * Todo: Figure out a better method to execute this.
   */
  remove () {
    this.width = 0; // set width of entity to 0
    this.height = 0; // set height of entity to 0
    this.x = -100; // set x position of entity off canvas
    this.y = -100; // set y position of entity off canvas
    this.direction = null; // set direction of the entity to null
    this.speed = null; // set speed of entity to null

  }

  /**
   * Renders an updated HP Bar for entities that use it.
   * @param relativity - Size of bar in relation to HP - hp/relativity
   * @param weight - Thickness of bar
   * @param xOffset - x position offset
   * @param yOffset - y position offset
   * @param color - HP bar color
   */
  hitPoints ({relativity = 2, weight = 5, xOffset = 0, yOffset = 0, color = "red"}) {
    if (window.ctx && window.canvas && this.hp > 0) { // check if ctx & canvas is accessible and if hp of entity is greater than zero.
      window.ctx.fillStyle = color; // set fill color
      window.ctx.fillRect(this.x + xOffset, this.y + yOffset, this.hp / relativity, weight); // render hp bar for this entity
    }
  }

  /**
   * Assigns new sprite to entity based on action provided.
   * @param action
   */
  newSprite (action) {
    this.character.src = this.action[action].source; // set sprite source
    this.width = this.action[action].width / this.action[action].columns; // set sprite width
    this.frameCount = this.action[action].columns; // set sprite count
    this.currentFrame = 0; // reset sprite frame to zero
  }

  /**
   * Set a new direction for entity.
   * @param direction
   */
  newDirection (direction) {
    this.direction = direction;
  }

}

/**
 * Player class - used for player character.
 */
class Player extends Entity {
  constructor (...props) {
    super(...props);
    this.keys = {}; // tracks keys pressed
    this.attacking = false; // updates when player is attacking
    this.spriteStatus = false; // checks if sprite has been changed - prevents changing sprite every loop.
  }

  /**
   * Clears frame after super has updated frame,
   * after clearing, this new frame will be rendered by the render() function.
   */
  updateFrame () {
    super.updateFrame();
    if (window.ctx) { // check if ctx variable is accessible
      window.ctx.clearRect(this.x, this.y, this.width, this.height); // clears frame
    }
  }

  /**
   * Updates player movement on board.
   * We use the delta variable here to keep the speed of the game the same
   * on all browsers, otherwise, player can move way too fast or too slow.
   */
  update (dt) {
    if (window.ctx) { // check if ctx is accessible
      this.updateSprite(dt); // update sprite
    }
  }

  /**
   * Update the player's HP
   * Checks player has more than zero HP, if so, execute change.
   * Otherwise, show lose screen.
   * @param hp
   */
  updateHP (hp) {
    if (this.hp > 0) { // check if player HP is > 0
      this.hp += hp; // update HP with value passed in
    } else if (window.screens && this.hp <= 0 && window.sounds) { // check if screen and sounds array is accessible
      this.remove(); // remove player
      window.sounds.gamePlay.stop(); // stop game
      window.sounds.gameOver.playSound(); // play game over sound
      window.screens.lose.initEnd({ // initiate the end screen - you lose!
        message: "You Lose!"
      });
    }
  }

  /**
   * Update player entity
   * Updates sprite status, sprite, sourceX and tracking.
   * Handles collision based on direction and resets tracking when appropriate.
   * @param dt - Delta
   */
  updateSprite (dt) {
    if (this.direction === 1) { // if right
      this.updateSpriteProps(1, "right"); // change sprite
      this.collision(1, dt); // collision detection for right direction, pass delta
      this.trackRight = this.trackRight === this.frameCount ? 1 : this.trackRight; // Resets tracking when it reaches the frameCount for this action.
    }
    if (this.direction === 2) { // if down
      this.updateSpriteProps(2, "down"); // change sprite
      this.collision(2, dt); // cd for down direction, pass delta
      this.trackDown = this.trackDown === this.frameCount ? 1 : this.trackDown;  // Resets tracking when it reaches the frameCount for this action.
    }
    if (this.direction === 3) {
      this.updateSpriteProps(3, "left"); // cd for left direction, pass delta
      this.collision(3, dt); // -
      this.trackLeft = this.trackLeft === this.frameCount ? 1 : this.trackLeft; // Resets tracking when it reaches the frameCount for this action.
    }
    if (this.direction === 4) {
      this.updateSpriteProps(4, "up"); // cd for up direction, pass delta
      this.collision(4, dt);
      this.trackUp = this.trackUp === this.frameCount ? 1 : this.trackUp; // Resets tracking when it reaches the frameCount for this action.
    }
  }

  /**
   * Update tracking - for use in sprite animation to know what frame to render.
   * @param direction
   */
  updateTracking (direction) {
    direction === 1 ? this.trackRight += 1 :
      direction === 2 ? this.trackDown += 1 :
        direction === 3 ? this.trackLeft += 1 :
          this.trackUp += 1;
  }

  /**
   * Update sourceX - width of player * direction given
   * @param direction
   */
  updateSourceX (direction) {
    this.sourceX = this.width * (direction === 1 ? this.trackRight :
      direction === 2 ? this.trackDown :
        direction === 3 ? this.trackLeft :
          this.trackUp);
  }

  updateSpriteStatus (status) {
    this.spriteStatus = status;
  }

  /**
   * Updates some of the player's properties - Sprite, sprite status, sourceX and tracking.
   * @param direction
   * @param action
   */
  updateSpriteProps (direction, action) {
    if (!this.spriteStatus) {
      this.newSprite(action); // set new sprite based on action passed in
      this.updateSpriteStatus(true); // update sprite status
      this.updateSourceX(direction); // update sourceX based on direction passed in
      this.updateTracking(direction); // update tracking based on direction passed in
    }
  }

  /**
   * Basic collision detection for map boundaries
   * @param direction (up, right, down, left : 4, 1, 2, 3)
   * @param dt (delta - time)
   */
  collision (direction, dt) {
    // For sake of brevity - single letter variables
    const H = this.height, // player height
      W = this.width, // player width
      X = this.x, // player x coordinate
      Y = this.y; // player y coordinate

    // if player tries moving UP
    if (direction === 4) {
      // collision detection for steps section of map
      // if player's Y coordinate is less than or equal to 400 + player's half height AND
      // player's Y coordinate is less than or equal to 431 pixels AND
      // player's X coordinate is less than 205 OR greater than 265
      // then player cannot move up
      if ((Y >= 400 + H / 2 && Y <= 431) && (X < 205 || X > 265)) {
        this.y += 0; // can't move up
      }
      // collision detection for top gate part of map 1
      // if player's Y coordinate is greater than or equal to 0 AND
      // player's Y coordinate is less than or equal to 71 AND
      // player's X is less than 190 OR
      // player's X is greater than 265 pixels
      // then player cannot move up
      else if ((Y >= 0 && Y <= 71) && (X < 190 || X > 265)) {
        this.y += 0; // can't move up
      }
      // default collision detection
      // if player's Y is greater than player's height in half
      // then player can move up
      else if (Y > H / 2) {
        this.y -= this.speed * dt; // move up
      }
    }

    // if player tries moving DOWN
    if (direction === 2) {
      // if player's Y coordinate is greater than or equal to 386 AND
      // player's Y coordinate is less than or equal to 431 - player's half height AND
      // player's X coordinate is less than 205 OR
      // player's X coordinate is greater than 265
      // then player cannot move down
      if ((Y >= 386 && Y <= 431 - H / 2) && (X < 205 || X > 265)) {
        this.y += 0; // can't move
      }
      // Default collision detection
      // if player's Y coordinate is less than canvas height - (player height + player's half height) then
      // player can move down
      else if (Y < canvas.height - (H + H / 2)) {
        this.y += this.speed * dt; // move down
      }
    }

    // if player tries moving RIGHT
    if (direction === 1) {
      // if player's Y coordinate is greater than 386 AND
      // player's Y coordinate is less than 431 AND
      // player's X coordinate is less than or equal to 190 - player's half width  OR
      // player's X coordinate is greater than or equal to 280 - player's half width
      // then player cannot move right
      if ((Y > 386 && Y < 431) && (X <= (190 - W / 2) || X >= (280 - W / 2))) {
        this.x += 0;
      }
      // if player's Y coordinate is greater than or equal to 0 AND
      // player's Y coordinate is less than 70 AND
      // player's X is greater than or equal to 265
      // then player cannot move right
      else if ((Y >= 0 && Y < 70) && (X >= 265)) {
        this.x += 0;
      }
      // if player's X coordinate is less than canvas width - (player's width + player's half width)
      // then player can move right
      else if (X < canvas.width - (W + W / 2)) {
        this.x += this.speed * dt; // can move right
      }
    }

    // if player tries move LEFT
    if (direction === 3) {
      // if player's Y coordinate is greater than 386 AND
      // player's Y coordinate is less than 431 AND
      // player's X coordinate is less than or equal to 190 - player's half width OR
      // player's X coordinate is greater than or equal to 280 + player's half width
      // then player cannot move
      if ((Y > 386 && Y < 431) && (X <= (190 + W / 2) || X >= (280 + W / 2))) {
        this.x += 0; // cannot move
      }
      // if player's Y coordinate is greater than or equal to 0 AND
      // player's Y coordinate is less than 70 AND
      // player's X coordinate is less than or equal to 190
      // then player cannot move
      else if ((Y >= 0 && Y < 70) && (X <= 190)) {
        this.x += 0; // cannot move
      }
      // if player's X coordinate is less than 0
      else if (X < 0) {
        this.x = 0; // cannot move
      }
      // if player's X coordinate is greater than player's half width
      // then player can move left
      else if (X > W / 2) {
        this.x -= this.speed * dt; // move left
      }
    }

  }

  /**
   * Check if player is attacking.
   * If true, player sprite changes based on previous direction.
   */
  attack () {
    if (this.attacking && window.sounds) {
      const D = this.previousDirection;
      this.newSprite(D === 1 ? "attackRight" : D === 2 ? "attackDown" : D === 3 ? "attackLeft" : "attackUp");
      window.sounds.playerHit.playSound();
    }
  }

  /**
   * Save previous direction
   */
  saveDirection () {
    this.previousDirection = this.direction ? this.direction : this.previousDirection;
  }

  /**
   * Fires when allowed key is pressed
   * Shift key detection as second parameter, false by default.
   * @param key
   * @param shift
   */
  keyPressed (key, shift = false) {

    if (this.controllable) {
      if (key <= 4) { // if directional key
        if (shift) { // if shift key is pressed
          this.speed = this._run(); // set speed to run speed
        } else {
          this.speed = this._walk(); // set speed to regular/walk speed
        }

        if (this.direction === false && key) { // if direction is false and key is set
          this.newDirection(key); // change direction to new direction
          this.saveDirection(); // save current direction
        }
      } else if (key === 6) { // if space bar is pressed
        this.attacking = true; // set attacking to true
        this.attack(); // fire the attack function
      }
    }
  }

  /**
   * Fires when allowed key is released.
   * @param key
   */
  keyReleased (key) {
    if (this.controllable) {
      if (key <= 4) { // if key released is a directional key
        this.direction = false; // set direction to false
        this.speed = 0; // set speed to zero
      } else if (key === 6) { // if key released is the space bar
        this.attacking = false; // player is no longer attacking
      }

      this.spriteStatus = false; // set sprite status to false
      this.newSprite("idle"); // set player to idle
    }
  }

  /**
   * Initializes player instance
   */
  init () {
    super.init();
    const keys = { // allowed keys
      32: 6, // space bar
      37: 3, // left
      38: 4, // up
      39: 1, // right
      40: 2 // down
    };

    /**
     * Event listener - on key down / press
     */
    document.addEventListener("keydown", e => {
      e.preventDefault(); // prevent default behavior

      let k = e.keyCode ? e.keyCode : e.which; // get key character code

      if (e.shiftKey && k && keys[k]) { // check if user is pressing shift key && another key
        this.keyPressed(keys[k], true); // sends input if valid to keyPressed function
      } else if (keys[k]) { // if key is valid but shift button ins't pressed.
        this.keyPressed(keys[k]);
      }

      if (!this.keys.hasOwnProperty(k)) { // if key collection doesn't have current key...
        this.keys[k] = true; // add to collection.
      }
    });

    /**
     * Event listener - on key up / release
     */
    document.addEventListener("keyup", e => {
      e.preventDefault(); // prevent default behavior

      let k = e.keyCode ? e.keyCode : e.which; // get key character code

      if (keys[k]) { // if key is allowed

        this.keyReleased(keys[k]); // fire keyRelease function passing the keyCode

        delete this.keys[k]; // remove this key from collection
      }

    });
  };
}

/**
 * Enemy class with create function for creating new enemies
 */
class Enemy extends Entity {
  constructor (...props) {
    super(...props);
    this.follow = false; // when true, enemy will follow player
    this.tracker = 0; // iterator
    this.hitTracker = 0; // attack iterator
  }

  /**
   * Update enemy character HP
   * @param hp
   */
  updateHP (hp) {
    this.hp += hp; // update enemy's HP

    /**
     * If HP is less than zero
     * Set status of this enemy to false
     * Increase number of enemies killed
     * Increase game score by +100 and remove this enemy character
     */
    if (this.hp <= 0 && window.game) {
      this.status = false; // set status to false
      game.enemiesKilled += 1; // increase number of enemies killed
      game.score += 100; // increase game score
      this.remove(); // remove this enemy character

    }
  }

  /**
   * Update the enemy character
   * @param dt
   */
  update (dt) {
    if (this.direction === 1) { // if direction is right
      this.x += this.speed * dt; // move character
    } else if (this.direction === 3) { // if direction is left
      this.x -= this.speed * dt; // move character
    }

    // when off canvas, reset position of enemy to move across again
    if (this.x > canvas.width + 100 && this.direction === 1) { // if character is moving right and out of canvas
      this.x = -100; // move character off canvas to start coming back in
      this.speed = 10 + Math.floor(Math.random() * 100); // change the speed of the character
    }
    else if (this.x < -100 && this.direction === 3) { // if character is moving left and out of canvas
      this.x = canvas.width + 20; // move character out of canvas to start coming back in
      this.speed = 10 + Math.floor(Math.random() * 100);
    }

    this.playerChase(); // check if enemy should chase player
    this.playerCollision(); // check for collision with player
  }

  /**
   * Checks if enemy should chase player
   * Handles logic for chasing player.
   * Read comments to follow along.
   */
  playerChase () {
    if (window.player && window.canvas) { // check that player and canvas are accessible
      const random = Math.floor(Math.random() * 8), // random number used to determine if enemy moves horizontal or vertically
        proximity = Entity.withinProximity(player.x, player.y, player.width / 1.5, player.height / 1.5, this.x, this.y, this.width / 1.5, this.height / 1.5);

      if (!this.follow) { // if enemy is currently NOT following
        if (proximity) { // check if player is within proximity
          this.follow = true; // if true, turn this flag on so enemy knows to follow player
        }
      } else if (this.follow) { // if enemy is currently following (flag is set to true)
        this.tracker += 1; // add +1 to tracker (will use to keep track of when to actually move)
        this.speed = 0; // set speed to 0
        this.direction = false; // set direction to false

        if (this.tracker === 20) {
          this.tracker = 0; // reset tracker

          if (random < 3) { // if random number is less than 3
            if (player.x - this.x < 0) { // if player's X - enemy's X is less than 0 - means enemy is on the right of the player
              this.newSprite("left"); // enemy sprite set to left
              this.x -= 10; // enemy will move left
              this.newDirection(3); // direction for enemy set to left
            } else { // enemy is on the left side of the player
              this.newSprite("right"); // enemy sprite set to right
              this.x += 10; // enemy will move right
              this.newDirection(1); // direction for enemy set to right
            }
          } else if (random > 3 && random < 6) { // if random number is greater than 3 and less than 6
            if (player.y - this.y < 0) { // if player's Y - enemy's Y is less than 0 - means enemy is below player
              this.newSprite("up"); // enemy sprite set to up
              this.y -= 10; // enemy moves up
              this.newDirection(4); // // direction for enemy set to up
            } else { // enemy is above the player
              this.newSprite("down"); // enemy sprite set to down
              this.y += 10; // enemy moves down
              this.newDirection(2); // direction for enemy set to down
            }
          } else {
            this.newSprite("idle"); // set enemy to idle until next command is given.
          }

        }
      }
    }
  }

  /**
   * Handles the player collision and checks if player is attacking.
   */
  playerCollision () {
    if (window.player) { // check if player variable is accessible
      /**
       * For the sake of brevity.
       * proximity checks if player is within proximity of enemy.
       * Review Entity.withinProximity() for an explanation of how it works.
       * @type {boolean}
       */
      const proximity = Entity.withinProximity(player.x, player.y, player.width / 2, player.height / 2, this.x, this.y, this.width / 2, this.height / 2);

      if (proximity) { // if player is within proximity in both x and y axis
        if (!player.attacking) { // if player is NOT attacking
          if (this.hitTracker === 10) { // check if hit iterator has reached desired iteration
            if (this.direction) { // update enemy direction
              this.hitTracker = 0; // reset iterator

              window.sounds.enemyHit.playSound(); // play hit sound
              /**
               * Based on the direction the enemy sprite is facing, we can figure out what
               * direction we want the player to be hit from. If enemy is moving up, we want the
               * player to be hit from the bottom. This is not very robust, but it adds to the experience a bit.
               */
              switch (this.direction) { // switch case based on direction
                case 4: // if up
                  player.newSprite("hitDown"); // set new player sprite
                  this.newSprite("attackUp"); // set enemy sprite to attack
                  break;
                case 2: // if down
                  player.newSprite("hitUp"); // set new player sprite
                  this.newSprite("attackDown"); // set enemy sprite to attack
                  break;
                case 1: // if right
                  player.newSprite("hitLeft"); // set new player sprite
                  this.newSprite("attackRight"); // set enemy sprite to attack
                  break;
                case 3: // if left
                  player.newSprite("hitRight"); // set new player sprite
                  this.newSprite("attackLeft"); // set enemy sprite to attack
                  break;
              }
              player.updateHP(-2); // reduce player hit points
            }

          }
          else {
            this.hitTracker += 1; // add to hit tracker, skips player HP reduction logic & animations
          }
        }
        else if (player.attacking) { // if player is attacking
          if (player.previousDirection && window.sounds) { // check if variables are accessible
            window.sounds.playerHit.playSound(); // play sound - player hit
            switch (player.previousDirection) { // player previous direction
              case 4: // Up
                this.newSprite("hitDown"); // player is facing up, so enemy will be hit from the bottom
                this.y -= 20; // enemy jumps up
                break;
              case 2: // Down
                this.newSprite("hitUp"); // player is facing south, so enemy will be hit from above
                this.y += 20; // enemy jumps down
                break;
              case 1: // right
                this.newSprite("hitLeft"); // player is facing right, so enemy is hit from the left
                this.x += 20; // enemy jumps right
                break;
              case 3:
                this.newSprite("hitRight"); // player is facing left, so enemy is hit from the right
                this.x -= 20; // enemy jumps left
                break;
            }
            this.updateHP(-20); // reduce enemy's HP
          }
        }
      }

    }
  }

  /**
   * Enemy render function.
   */
  render () {
    super.render();
    window.ctx.drawImage(this.character, this.sourceX, this.sourceY);
  }
}

/**
 * Prop class.
 * Used for creating props on map, including animated props.
 * Props can have special attributes affect player by adding it to the callback property (one of it's many potential uses)
 */
class Prop extends Entity {
  constructor (...props) {
    super(...props);
    this.active = false; // active flag
    this.special = true; // special flag
  }

  /**
   * Prop render function
   */
  render () {
    super.render();
    window.ctx.drawImage(this.character, this.sourceX, this.sourceY);
  }

  /**
   * Special effect activation.
   * Active = Check if user is within proximity to 'pick up' item.
   * If active, check if callback is set, if this prop has a special effect
   * and if we have access to allProps variable. If so, fire the callback function.
   */
  activate () {
    const proximity = Entity.withinProximity(player.x, player.y, player.width / 2, player.height / 2, this.x, this.y, this.width / 2, this.height / 2);

    /**
     * Checks if all variables we need are accessible
     */
    if (proximity && this.callback && this.special && window.allProps) {
      this.callback(); // fire callback defined in prop creation function
    }

  }
}
