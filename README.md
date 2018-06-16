# James in the Dungeon of Slime [![lloan alas logo](https://raw.githubusercontent.com/lloan/udacity/master/fend/memory/img/lloanalas-logo-button.png)](https://lloanalas.com)


[![lloan alas logo](https://raw.githubusercontent.com/lloan/JDS/master/images/screenshots/player.gif)](https://lloanalas.com)

## Introduction 
James in the Dungeon of Slime (JDS) is a top down, 1-player game. It runs on HTML 5 and JavaScript. Built for Udacity's FEND Nanondegree Arcade Game project.   

## Instructions
To play the JSD, you need to download the repository and open the `index.html` file. All dependencies will be loaded through `index.html`.

##### Online
To play online, you can access the game here: `https://lloan.github.io/JDS/`.
##### Locally 
To start, clone the repository to your local machine:

`git clone https://github.com/lloan/JDS.git`

Navigate to the folder, within the root of the folder, find the `index.html` file and open it with your browser. 

## How to Play
The goal of the game is to kill all the slime and get the key. Enemies are randomly spawned in number and location. What is the highest score you can get? If you're lucky, you might get several potions spawned.
- You can move the player character with the `arrow keys` [up, down, left, right]. 
- Pressing `shift + arrow Keys` makes your player character move faster.
- Pressing the `space bar` allows your player character to attack slime.
- If player is within proximity of any slime character, the slime will start following to attack.
- Potions can be picked up, they heal you +50 each. Spawned randomly.
- Number of enemies are spawned randomly.

## Under the Hood
JDS uses the HTML 5 Canvas API and JavaScript (ES6) without transpiling. A couple of classes exist which can be extended to add additional features to the game. 

Classes:
- Audio - handles audio resources
- Debug - handles debugging functions. Example: `Debug.collision()`
- Engine - handles main game engine logic
- Entity - template for building entities - supports sprite animation.
- Game - handles the game logic as the composer, putting everything together.
- Resources - handles loading of image resources.
- Screen - handles screens such as intro, winning, losing, etc. 

## Dependencies 
- Google Fonts - VT323  

## Screenshots 
 **Gameplay**
 
 ![Gameplay](https://raw.githubusercontent.com/lloan/JDS/master/images/screenshots/gameplay.jpg)

  

## Contribute
To contribute to the project, you can add suggestions for features, bug reports or design enhancements. You can also fork a copy of this game and make it your own.