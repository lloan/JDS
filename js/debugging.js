/**
 * Debugging class.
 * Can add different functions to test things within the engine.
 * Future use. Example function added: collision().
 */
class Debug {

  static collision () {
    if (window.engine && window.ctx) { // check if engine and ctx are accessible
      ctx.strokeStyle = "#FF0000";  // Set border color
      ctx.lineWidth = 2;         // Set width of border

      // add this function to the render queue so it gets rendered
      engine.renderingQueue.push(() => { // pushes this anonymous function in to the renderingQueue array
        if (window.player) { // check if player variable is accessible
          ctx.strokeRect(player.x, player.y, player.width, player.height); // use the player's coordinates and dimensions to render the box
        }

        if (window.allEnemies) { // check if allEnemies variable is accessible
          allEnemies.forEach((enemy) => { // iterate through array of enemies
            ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height); // use the enemy's coordinates and dimensions to render the box
          });
        }

        if (window.allProps) { // check if allEnemies variable is accessible
          allProps.forEach((prop) => { // iterate through array of enemies
            ctx.strokeRect(prop.x, prop.y, prop.width, prop.height); // use the enemy's coordinates and dimensions to render the box
          });
        }
      });
    }
  }

}