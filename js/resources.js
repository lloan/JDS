/**
 * Resources Class
 * Image loading utility.
 */
class Resources {
  constructor () {
    this.cache = {};
    this.readyCallbacks = [];
  }

  /**
   * Iterates through all image urls passed in.
   * Differentiates between array and single value.
   * @param paths
   */
  load (paths) {
    paths instanceof Array ? paths.forEach(url => this._load(url)) : this._load(paths);
  }

  /**
   * Checks if image is already in our cache.
   * Loads the images to our cache if not in there yet, executes all our callback functions -
   * if isReady() returns true.
   *
   * @param path
   * @private
   */
  _load (path) {
    if (this.cache[path]) { // check if path in our cache
      return this.cache[path]; // return image object
    } else {
      const img = new Image(); // create new image object
      img.onload = () => { // when image is loaded
        this.cache[path] = img; // we store this inside our cache object
        if (this.isReady()) { // if all images have been loaded
          this.readyCallbacks.forEach(func => func()); // all callback functions executed
        }
      };

      /* Set the initial cache value to false, this will change when
       * the image's onload event handler is called. Finally, point
       * the image's src attribute to the passed in URL.
       */
      this.cache[path] = false;
      img.src = path;
    }
  }

  /**
   * Get reference to image
   *
   * @param path
   * @returns image object
   */
  get (path) {
    return this.cache[path];
  }

  /**
   * Check if all images requested have properly loaded.
   */
  isReady () {
    let ready = true;
    for (let k in this.cache) {
      if (this.cache.hasOwnProperty(k) && !this.cache[k]) {
        ready = false;
      }
    }
    return ready;
  }

  /**
   * Add function to callback array, to be fired when images are all loaded.
   * @param cb
   */
  onReady (cb) {
    this.readyCallbacks.push(cb);
  }
}

/**
 * For Use In-Game
 * Globally accessible in browser
 * @type {Resources}
 */
window.resources = new Resources();

/**
 * Loads all resources we expect to use
 */
resources.load([
  "images/map/level_one.jpg",
  "images/assets/torch.png",
  "images/screen/enemy.png",
  "images/assets/hp-potion.png",
  "images/player/p-attack-down.png",
  "images/player/p-attack-left.png",
  "images/player/p-attack-right.png",
  "images/player/p-attack-up.png",
  "images/player/p-down.png",
  "images/player/p-hit-down.png",
  "images/player/p-hit-left.png",
  "images/player/p-hit-right.png",
  "images/player/p-hit-up.png",
  "images/player/p-idle.png",
  "images/player/p-left.png",
  "images/player/p-right.png",
  "images/player/p-up.png",
  "images/enemy/slime-blue-attack-down.png",
  "images/enemy/slime-blue-attack-right.png",
  "images/enemy/slime-blue-attack-left.png",
  "images/enemy/slime-blue-attack-up.png",
  "images/enemy/slime-blue-down.png",
  "images/enemy/slime-blue-hit-down.png",
  "images/enemy/slime-blue-hit-right.png",
  "images/enemy/slime-blue-hit-up.png",
  "images/enemy/slime-blue-idle.png",
  "images/enemy/slime-blue-idle2.png",
  "images/enemy/slime-blue-right.png",
  "images/enemy/slime-blue-left.png",
  "images/enemy/slime-blue-up.png",
  "images/enemy/slime-green-attack-down.png",
  "images/enemy/slime-green-attack-right.png",
  "images/enemy/slime-green-attack-left.png",
  "images/enemy/slime-green-attack-up.png",
  "images/enemy/slime-green-down.png",
  "images/enemy/slime-green-hit-down.png",
  "images/enemy/slime-green-hit-right.png",
  "images/enemy/slime-green-hit-up.png",
  "images/enemy/slime-green-idle.png",
  "images/enemy/slime-green-idle2.png",
  "images/enemy/slime-green-right.png",
  "images/enemy/slime-green-left.png",
  "images/enemy/slime-green-up.png",
  "images/enemy/slime-red-attack-down.png",
  "images/enemy/slime-red-attack-right.png",
  "images/enemy/slime-red-attack-left.png",
  "images/enemy/slime-red-attack-up.png",
  "images/enemy/slime-red-down.png",
  "images/enemy/slime-red-hit-down.png",
  "images/enemy/slime-red-hit-right.png",
  "images/enemy/slime-red-hit-up.png",
  "images/enemy/slime-red-idle.png",
  "images/enemy/slime-red-idle2.png",
  "images/enemy/slime-red-right.png",
  "images/enemy/slime-red-left.png",
  "images/enemy/slime-red-up.png"
]);

