/**
 * Sound class
 * Constructor takes in a path as the source for the
 * audio file to be used.
 */
class Sound {
  constructor (source) { // source passed in as a path
    this.source = source;
    this.sound = document.createElement("audio"); // creates an audio element
  }

  /**
   * Sets the sound source from the source property
   */
  setSource () {
    this.sound.src = this.source;
  }

  /**
   * Appends the audio element to the document's body.
   */
  addSound () {
    if (window.sounds) {
      document.body.appendChild(this.sound);
    }
  }

  /**
   * Configures the audio elements settings for use in browser.
   */
  setup () {
    this.sound.setAttribute("preload", "auto"); // pre-loading
    this.sound.setAttribute("controls", "none"); // remove controls
    this.sound.volume = 0.3; // set volume to something low as this will auto play
    this.sound.style.display = "none"; // hide element visibility
  }

  /**
   * Play sound
   */
  playSound () {
    this.sound.play();
  }

  /**
   * Stop sound
   */
  stop () {
    this.sound.pause();
  }

  /**
   * Initialize the sound instance.
   */
  init () {
    this.setSource();
    this.setup();
    this.addSound();
  }
}