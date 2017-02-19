///////////////////////////////////////////////////////////////
//                                                           //
//                    CONSTANT STATE                         //
var TITLE_IMAGE = loadImage("titleScreen.png");
var INSTRUCTIONS = loadImage("instructions.png");

var LEVEL_SCREEN_1 = loadImage("skyScreen.png");
var LEVEL_SCREEN_2 = loadImage("mountainScreen.png");
var LEVEL_SCREEN_3 = loadImage("caveScreen.png");
var LEVEL_SCREEN_4 = loadImage("jungleScreen.png");
var LEVEL_SCREEN_5 = loadImage("abyssScreen.png");

var BACKGROUND_IMAGE = loadImage("backgroundfloatingislands2.png");
var BACKGROUND_IMAGE_2 = loadImage("backgroundMountains3.png");
var BACKGROUND_IMAGE_3 = loadImage("backgroundCave2.png");
var BACKGROUND_IMAGE_4 = loadImage("backgroundjunglelight2.png");
var BACKGROUND_IMAGE_5 = loadImage("backgroundjungledark.png");

var WIN_IMAGE = loadImage("winScreen.png");
var LOSE_IMAGE = loadImage("loseScreen.png");

var MAIN_MUSIC = loadSound("489107_Fields-of-Glory.mp3");
var BOSS_MUSIC_1 = loadSound("551325_Combat-Theory.mp3");
var BOSS_MUSIC_2 = loadSound("565391_COHA---Contraship.mp3");
var VICTORY_MUSIC = loadSound("617390_Victory.mp3");

var ENEMY_IMAGE = loadImage("enemy1blackEDITED.png");
var ENEMY_IMAGE_2 = loadImage("enemy1whiteEDITED.png");

var ENEMY2_IMAGE_BLACK = loadImage("Enemy2black.png");
var ENEMY2_IMAGE_WHITE = loadImage("Enemy2white.png");

var ENEMY3_IMAGE_BLACK = loadImage("enemy3black.png");
var ENEMY3_IMAGE_WHITE = loadImage("enemy3white.png");

var ENEMY_TORPEDO_IMAGE = loadImage("bullet2black.png");
var ENEMY_TORPEDO_IMAGE_2 = loadImage("bullet2white.png");

var BOSS1_IMAGE_BLACK = loadImage("Boss1black.png");
var BOSS1_IMAGE_WHITE = loadImage("Boss1white.png");

var BOSS2_IMAGE_BLACK = loadImage("Boss2blackSmall.png");
var BOSS2_IMAGE_WHITE = loadImage("Boss2whiteSmall.png");

var PLAYER_IMAGE_BLACK = loadImage("playerblack3.png");
var PLAYER_IMAGE_WHITE = loadImage("playerwhite2.png");
var PLAYER_IMAGE_BLACK_2 = loadImage("playerblack3Flipped.png");

var PLAYER_TORPEDO_IMAGE = loadImage("bullet1black.png");
var PLAYER_TORPEDO_IMAGE_2 = loadImage("bullet1.png");

var TORPEDO_SPEED = 1000; // pixels/second

var ENEMY_TORPEDO_SPEED = 200; // pixels/second

var ENEMY_TORPEDO_RECHARGE_TIME = 3; // second

var PLAYER_SPEED = 600; // pixels / second
var PLAYER_TORPEDO_RECHARGE_TIME = 0.1; // seconds;

var SCORE_TEXT_X = 250;
var SCORE_TEXT_Y = 170;

var X_BASE_SPEED = 100; // enemy base horizontal speed

var MUSIC_RECHARGE_TIME = 46;
var MUSIC_RECHARGE_TIME_2 = 277;
var MUSIC_RECHARGE_TIME_3 = 107;
var MUSIC_RECHARGE_TIME_4 = 64;

var BACK_X = 0;
var BACK_X_2 = 5758;
var BACK_Y = 0;


///////////////////////////////////////////////////////////////
//                                                           //
//                     MUTABLE STATE                         //

// Virtual directional pad
var dpad;

// The player's character
var player;

// All active torpedos.  See createTorpedo()
var torpedoArray;

// All Enemies and their torpedos. See createEnemies() and createEnemyTorpedo()
var enemyArray;
var enemyTorpedoArray;

// Wave and level arrays. See createWave() and createLevel()
var waveArray;
var levelArray;

var music_last_time = 0;

var game_start = false

var score = 10000;

var waveNum = 0;
var levelNum = 0;
var groupNum = 0;

var int = 0;

var victory = false;
var lose = false;

var bossBulletNum = 0;

var groupLastTorpedoTime = 0;
var now2;
var levelStopTime = 0;
var levelPauseTime = 0;
var godMode = false;

///////////////////////////////////////////////////////////////
//                                                           //
//                      EVENT RULES                          //

defineGame("HIKARI YAMI", "codeheart.js developer", "titleScreen.png", "H");

// When setup happens...
function onSetup() {

    player = [];
    var t = 0;
    while (t < 2) {
        player[t] = makeObject();

        if (t == 1) {
            player[t].image = PLAYER_IMAGE_BLACK;
            player[t].bulletType = "black";
        } else {
            player[t].image = PLAYER_IMAGE_WHITE;
            player[t].bulletType = "white";
        }
        player[t].position = makeObject();
        player[t].position.x = screenWidth / 5;
        player[t].position.y = screenHeight / 3 + 250 * t;

        player[t].velocity = makeObject();
        player[t].velocity.x = 0;
        player[t].velocity.y = 0;
        player[t].alive = true;

        // When the last torpedo was fired
        player[t].lastTorpedoTime = 0;
        player[t].color = t;
        player[t].inverse = false;
        player[t].width = 153.9;
        player[t].height = 156;
        t++;
    }
    now2 = currentTime();
    torpedoArray = [];
    enemyArray = [];
    enemyTorpedoArray = [];
    waveArray = [];
    levelArray = [];
    createDPad();


    createLevel(0, 1, 2); // level time span and number of waves
    createLevel(1, 3, 5);
    createLevel(2, 5, 5);
    createLevel(3, 7, 5);
    createLevel(4, 8, 5);
    createLevel(5, 9, 1);
    createWave(1, 0, 1, 0.5, false); // this is where waves are created. createWave( wave Type(see onTick), number of Enemies, time taken for the wave to start after the previous wave, interval between spawned Enemies)
    createWave(1, 5, 1, 1, true); //Level 1: The Sky (Horde)
    createWave(1, 5, 1, 1, true);
    createWave(2, 6, 1, 2, true); //Level 2: The Mountains (Flippers)
    createWave(3, 6, 1, 2, true);
    createWave(6, 5, 1, 4, true); //Level 3: The Cave (Seekers)
    createWave(7, 5, 1, 5, true);
    createWave(4, 1, 1, 2, true); //Level 4: The Jungle (Boss 1)
    createWave(5, 1, 1, 2, true); //Level 5: The End (Boss 2)

}

// When a key is pushed
function onKeyStart(key) {
    var now = currentTime();

    if ((key == asciiCode(" ")) && !game_start) {
        game_start = true;
    } else {
        if (now - levelStopTime > 1.8) {
            if ((key == asciiCode("T")) &&
                (now - player[0].lastTorpedoTime > PLAYER_TORPEDO_RECHARGE_TIME && player[0].alive)) {

                if (player[0].inverse == true) {
                    createTorpedo(player[0].position.x - player[0].width / 2,
                        player[0].position.y, PLAYER_TORPEDO_IMAGE_2, player[0].bulletType, "inverse");
                } else {
                    createTorpedo(player[0].position.x + player[0].width / 2,
                        player[0].position.y, PLAYER_TORPEDO_IMAGE_2, player[0].bulletType, "normal");
                }

                player[0].lastTorpedoTime = now;

            } else if ((key == asciiCode("P")) && (now - player[1].lastTorpedoTime > PLAYER_TORPEDO_RECHARGE_TIME && player[1].alive)) {


                if (player[1].inverse == true) {
                    createTorpedo(player[1].position.x - player[1].width / 2,
                        player[1].position.y, PLAYER_TORPEDO_IMAGE, player[1].bulletType, "inverse");
                } else {
                    createTorpedo(player[1].position.x + player[1].width / 2,
                        player[1].position.y, PLAYER_TORPEDO_IMAGE, player[1].bulletType, "normal");
                }


                player[1].lastTorpedoTime = now;
            } else if (key == asciiCode("7")) {
                if (!godMode) {
                    godMode = true;
                } else if (godMode) {
                    godMode = false;
                }
            }
        }
        processDPadKey(key, true);

    }

}


function onKeyEnd(key) {
    processDPadKey(key, false);
}


// Called 30 times or more per second
function onTick() {
    // Assume 1/30 second per frame
    var time = 1.0 / 30.0;
    applyControls();

    if (game_start) {
        console.log(length(enemyArray));
        movePlayer(time);
        moveTorpedos(time);
        moveEnemies(time);
        playMusic();

        if (player[0].alive) {
            doPhysics();
            runWave();
        }
    }

    drawScreen();
}


///////////////////////////////////////////////////////////////
//                                                           //
//                      CREATION RULES                         //

// Create a new torpedo at (x, y) and insert it into torpedoArray
function createTorpedo(x, y, theImage, colorValue, typeV) {
    if ((player[0].alive || player[1].alive) && !victory) { // Prevents the creation of torpedoes if the starkami is dead
        var torpedo;

        // Create the new torpedo
        torpedo = {
            image: theImage,
            position: {
                x: x,
                y: y
            },
            colorType: colorValue, //torpedo color
            typeValue: typeV, // condition for shooting backwards (only in last level)
            width: 60,
            height: 60
        };

        // Insert it into our list
        insertBack(torpedoArray, torpedo);
    }
}

// Create enemy's torpedos

function createEnemyTorpedo(x, y, speed_x, speed_y, theImage, colorValue) {

    var enemyTorpedo;

    // Create the new enemy torpedo
    enemyTorpedo = {
        image: theImage,
        position: {
            x: x,
            y: y
        },
        velocity: {
            x: speed_x,
            y: speed_y
        },
        colorType: colorValue, // torpedo color
        width: 60,
        height: 60
    };
    insertBack(enemyTorpedoArray, enemyTorpedo);

}


// Creates an enemy
function createEnemies(x, y, speed_x, speed_y, enemyImage, bulletP, moveP, colorT, hpNum) {
    var enemy;
    enemy = {
        image: enemyImage,
        position: {
            x: x,
            y: y
        },

        velocity: {
            x: speed_x,
            y: speed_y
        },

        height: 115,

        width: 115,

        bulletPattern: bulletP, // specific bullet pattern. Handled in moveEnemies function

        movePattern: moveP, // specific move pattern. Handled in moveEnemies function

        lastTorpedoTime: currentTime(),

        lastTorpedoTime2: 0, // for boss1 and boss2 to make more complicated bullet patterns

        lastTorpedoTime3: currentTime(), // for boss2 to make more complicated bullet patterns

        theta: 6.284, // for boss2's circular attacks

        colorType: colorT, // enemy color type

        hp: hpNum, // enemy hp

        lastFlipTime: 0 // condition for flipping
    };

    // Insert it into our list
    insertBack(enemyArray, enemy);

}

// Creates a wave for enemies
function createWave(no, num, timeSpan, int, gateway) {
    var wave;
    wave = {
        waveType: no, // checks the enemy type

        count: num, // enemy count

        interval: int, // enemy spawn rate

        timeGap: timeSpan, // time that has to elapse after this wave ends and before the next wave begins.

        lastGapTime: 0, // condition for timeGap

        lastIntervalTime: 0, // condition for interval

        isGateway: gateway // Checks to see if all enemies need to be killed before this wave ends
    };

    // Insert it into our list
    insertBack(waveArray, wave);
}

// Creates a level.
function createLevel(levelT, waveNum, timeSpan) {
    var level;
    level = {

        levelType: levelT, // level number (just as an indicator in the code)

        num: waveNum, // cumulative number of waves of the level. Condition to transition between levels.

        timeGap: timeSpan, // time that has to elapse after this level ends and before the next level begins.

        lastGapTime: 0, // condition for timeGap
    };

    // Insert it into our list
    insertBack(levelArray, level);
}

// Moves torpedos.
function moveTorpedos(time) {
    var t;
    var torpedo;

    t = 0;
    while (t < length(torpedoArray)) {
        torpedo = torpedoArray[t];

        if (torpedo.typeValue == "normal") {
            torpedo.position.x = torpedo.position.x + TORPEDO_SPEED * time;
        } else if (torpedo.typeValue == "inverse") {
            torpedo.position.x = torpedo.position.x - TORPEDO_SPEED * time;
        }

        if (torpedo.position.x - torpedo.image.width / 2 > 1920 || torpedo.position.x + torpedo.image.width / 2 < 0) {
            // This torpedo is off screen
            removeAt(torpedoArray, t);
        } else {
            // Go on to the next torpedo
            t = t + 1;
        }
    }

    t = 0

    while (t < length(enemyTorpedoArray)) {
        torpedo = enemyTorpedoArray[t];
        torpedo.position.x = torpedo.position.x + ENEMY_TORPEDO_SPEED * torpedo.velocity.x * time;
        torpedo.position.y = torpedo.position.y + ENEMY_TORPEDO_SPEED * torpedo.velocity.y * time;

        if (torpedo.position.y + torpedo.image.height / 2 < 0 || torpedo.position.x + torpedo.image.width / 2 < 0 || torpedo.position.y - torpedo.image.height / 2 > screenHeight || torpedo.position.x - torpedo.image.width / 2 > screenWidth) {
            // This torpedo is off screen
            removeAt(enemyTorpedoArray, t);

        } else {
            // Go on to the next torpedo
            t = t + 1;
        }
    }
}

// Moves enemies according to movement type. Also handles special events caused by movement pattern. e.g: Flippers flip colors here.
function moveEnemies(time) {

    var t;
    var enemy;

    t = 0;
    while (t < length(enemyArray)) {

        enemy = enemyArray[t];

        if (enemy.movePattern == "boss1") {
            if (enemy.position.x <= screenWidth / 1.12 && enemy.velocity.x != 0) {
                enemy.velocity.x = 0;
                enemy.velocity.y = 100;
            }
            if (enemy.position.y > screenHeight / 1.2 && enemy.velocity.y > 0) {
                enemy.velocity.y = -enemy.velocity.y;
            } else if (enemy.position.y < screenHeight / 8 && enemy.velocity.y < 0) {
                enemy.velocity.y = -enemy.velocity.y;
            }
        } else if (enemy.movePattern == "boss2") {
            if (enemy.position.y > screenHeight / 1.2 && enemy.velocity.y > 0) {
                enemy.velocity.y = -enemy.velocity.y;
            } else if (enemy.position.y < screenHeight / 8 && enemy.velocity.y < 0) {
                enemy.velocity.y = -enemy.velocity.y;
            }
            if (enemy.lastFlipTime >= 10) {
                if (enemy.colorType == "black") {
                    enemy.colorType = "white";
                    enemy.image = BOSS1_IMAGE_WHITE;
                    enemy.lastFlipTime = 0;
                } else {
                    enemy.colorType = "black";
                    enemy.image = BOSS1_IMAGE_BLACK;
                    enemy.lastFlipTime = 0;
                }
            }
        } else if (enemy.movePattern == "group") {
            if (enemy.position.x < screenWidth / 2 + 125 * enemy.groupNum && enemy.velocity.x == -200) {
                enemy.velocity.x = 0;
                enemy.velocity.y = -10;
            }
            if (enemy.velocity.x != -200) {
                if (now2 > currentTime() - 3) {
                    enemy.velocity.x = 0;
                    enemy.velocity.y = -20;
                } else if (now2 > currentTime() - 6) {
                    enemy.velocity.y = 0;
                    enemy.velocity.x = -20;
                } else if (now2 > currentTime() - 9) {
                    enemy.velocity.y = 20;
                    enemy.velocity.x = 0;
                } else if (now2 > currentTime() - 12) {
                    enemy.velocity.y = 0;
                    enemy.velocity.x = 20;
                } else {
                    now2 = currentTime();
                }
            }
        } else if (enemy.movePattern == "flip") {
            var now = currentTime();
            if (now - enemy.lastFlipTime > 3) {
                if (enemy.colorType == "black") {
                    enemy.colorType = "white";
                    enemy.image = ENEMY2_IMAGE_WHITE;
                    enemy.lastFlipTime = now;
                } else {
                    enemy.colorType = "black";
                    enemy.image = ENEMY2_IMAGE_BLACK;
                    enemy.lastFlipTime = now;
                }
            }
            if (enemy.position.x <= screenWidth / 1.12 && enemy.velocity.y == 0) {
                enemy.velocity.x = -100;
                enemy.velocity.y = 100;
            }
            if ((enemy.position.y > screenHeight / 1.2 && enemy.velocity.y > 0) || (enemy.position.y < screenHeight / 8 && enemy.velocity.y < 0)) {
                enemy.velocity.y = -enemy.velocity.y;
            } else if ((enemy.position.x < screenWidth / 8 && enemy.velocity.x < 0) || (enemy.position.x > screenWidth / 1.2 && enemy.velocity.x > 0)) {
                enemy.velocity.x = -enemy.velocity.x;
            }
        } else if (enemy.movePattern == "homing") {

            if (enemy.colorType == "black") {
                var num = 1;
            } else {
                var num = 0;
            }

            enemy.velocity.x = 300 * applyGradX(enemy, player[num]);
            enemy.velocity.y = 300 * applyGradY(enemy, player[num]);
        }

        if (enemy.movePattern != "dummy") {
            enemy.position.x = enemy.position.x + enemy.velocity.x * time;
            enemy.position.y = enemy.position.y + enemy.velocity.y * time;
        }
        if (player[0].alive) {

            if (enemy.bulletPattern == "normal") { //bullet pattern created here.
                var now = currentTime();

                if (now - enemy.lastTorpedoTime > ENEMY_TORPEDO_RECHARGE_TIME) {

                    if (enemy.colorType == "black") {
                        var num = 0;
                        var speed_x = applyGradX(enemy, player[num]);
                        var speed_y = applyGradY(enemy, player[num]);
                        createEnemyTorpedo(enemy.position.x, enemy.position.y, speed_x, speed_y, ENEMY_TORPEDO_IMAGE, "black");
                        enemy.lastTorpedoTime = now;
                    } else {
                        var num = 1;
                        var speed_x = applyGradX(enemy, player[num]);
                        var speed_y = applyGradY(enemy, player[num]);
                        createEnemyTorpedo(enemy.position.x, enemy.position.y, speed_x, speed_y, ENEMY_TORPEDO_IMAGE_2, "white");
                        enemy.lastTorpedoTime = now;
                    }

                    // causes the torpedo to move towards the player.


                }

            } else if (enemy.bulletPattern == "straight") {
                var now = currentTime();

                if (now - enemy.lastTorpedoTime > ENEMY_TORPEDO_RECHARGE_TIME) {

                    var speed_x = -2

                    var speed_y = 0

                    if (enemy.colorType == "black") {
                        var s = 0;
                        while (s < 1) {
                            createEnemyTorpedo(enemy.position.x, enemy.position.y, speed_x, speed_y, ENEMY_TORPEDO_IMAGE, "black", "normal");
                            speed_x = speed_x / 1.2;
                            speed_y = -speed_y / 2;
                            s++;
                        }
                    } else if (enemy.colorType == "white") {
                        var s = 0
                        while (s < 1) {
                            createEnemyTorpedo(enemy.position.x, enemy.position.y, speed_x, speed_y, ENEMY_TORPEDO_IMAGE_2, "white", "normal");
                            speed_x = speed_x / 1.2;
                            speed_y = -speed_y / 2;
                            s++;
                        }
                    }
                    enemy.lastTorpedoTime = now;
                }



            } else if (enemy.bulletPattern == "boss1") {
                var now = currentTime();

                if (now - enemy.lastTorpedoTime > ENEMY_TORPEDO_RECHARGE_TIME) {

                    if (now - enemy.lastTorpedoTime2 > 0.3) {
                        var theta = 3.142;

                        var speed_x = 2 * Math.sin(theta);

                        var speed_y = 2 * Math.cos(theta);

                        if (player[0].alive || player[1].alive) {
                            if (enemy.colorType == "black") {
                                var s = 0;
                                while (s < 11) {
                                    theta = theta + 3.142 / 10;
                                    speed_x = 2 * Math.sin(theta);
                                    speed_y = 2 * Math.cos(theta);
                                    createEnemyTorpedo(enemy.position.x - 15, enemy.position.y - enemy.height / 2.5 + 35, speed_x / 2, speed_y / 2, ENEMY_TORPEDO_IMAGE, "black");
                                    createEnemyTorpedo(enemy.position.x - 15, enemy.position.y - enemy.height / 2.5 + 35, speed_x / 3, speed_y / 3, ENEMY_TORPEDO_IMAGE_2, "white");

                                    s++;
                                }
                            } else if (enemy.colorType == "white") {
                                var s = 0;
                                while (s < 16) {
                                    theta = theta + 3.142 / 15;
                                    speed_x = 2.25 * Math.sin(theta);
                                    speed_y = 2.25 * Math.cos(theta);
                                    createEnemyTorpedo(enemy.position.x - 15, enemy.position.y - enemy.height / 2.5 + 35, speed_x / 2, speed_y / 2, ENEMY_TORPEDO_IMAGE_2, "white");
                                    createEnemyTorpedo(enemy.position.x - 15, enemy.position.y - enemy.height / 2.5 + 35, speed_x / 3, speed_y / 3, ENEMY_TORPEDO_IMAGE, "black");
                                    s++;
                                }
                            }
                            enemy.lastTorpedoTime2 = now;
                            bossBulletNum++;
                        }
                        if (bossBulletNum == 5) {
                            enemy.lastTorpedoTime = now;
                            bossBulletNum = 0;
                        }
                    }
                }
            } else if (enemy.bulletPattern == "boss2") {
                var now = currentTime();


                if (now - enemy.lastTorpedoTime > ENEMY_TORPEDO_RECHARGE_TIME - 1.5) {

                    if (now - enemy.lastTorpedoTime3 > 0.01) {
                        if (enemy.hp < 40) {
                            enemy.theta = enemy.theta - 6.284 / 27;
                            speed_x = 2.25 * Math.sin(enemy.theta);
                            speed_y = 2.25 * Math.cos(enemy.theta);
                            createEnemyTorpedo(enemy.position.x, enemy.position.y, speed_x, speed_y, ENEMY_TORPEDO_IMAGE_2, "white");
                            speed_x = 2.25 * Math.cos(enemy.theta);
                            speed_y = 2.25 * Math.sin(enemy.theta);
                            createEnemyTorpedo(enemy.position.x, enemy.position.y, speed_x, speed_y, ENEMY_TORPEDO_IMAGE, "black");
                            if (enemy.theta <= -6.248) {
                                enemy.theta = 6.284;
                            }
                        }
                        enemy.lastTorpedoTime3 = now;
                    }
                    if (now - enemy.lastTorpedoTime2 > 0.1) {
                        if (enemy.colorType == "black") {
                            var s = 0;

                            var speed_x = 4 * applyGradX(enemy, player[1]);
                            var speed_y = 4 * applyGradY(enemy, player[1]);

                            while (s < 3) {
                                createEnemyTorpedo(enemy.position.x, enemy.position.y, speed_x, speed_y, ENEMY_TORPEDO_IMAGE_2, "white");
                                speed_y = speed_y / 1.20;
                                speed_x = speed_x;
                                s++;
                            }

                        } else if (enemy.colorType == "white") {
                            var s = 0;
                            var speed_x = 4 * applyGradX(enemy, player[0]);
                            var speed_y = 4 * applyGradY(enemy, player[0]);
                            while (s < 3) {
                                createEnemyTorpedo(enemy.position.x, enemy.position.y, speed_x, speed_y, ENEMY_TORPEDO_IMAGE, "black");
                                speed_y = speed_y / 1.20;
                                speed_x = speed_x;
                                s++;
                            }
                        }
                        enemy.lastTorpedoTime2 = now;
                        bossBulletNum++;
                        if (bossBulletNum == 10) {
                            enemy.lastTorpedoTime = now;
                            bossBulletNum = 0;
                        }
                    }
                }
            }
        }
        if (enemy.position.y + enemy.height / 2 < 0 || enemy.position.y - enemy.height / 2 > screenHeight || enemy.position.x + enemy.width / 2 < 0 || enemy.position.x - enemy.width / 2 > screenWidth) {
            // This enemy is off screen
            removeAt(enemyArray, t);
        } else {
            // Go on to the next enemy.
            t++;
        }
    }
}

//Creates the waves of enemies and causes transition between levels.

function runWave() {
    var now = currentTime();
    var level = levelArray[levelNum];

    if (levelNum < length(levelArray) && (now - level.lastGapTime > level.timeGap)) {

        var wave = waveArray[waveNum];
        if (waveNum < length(waveArray) && (now - wave.lastGapTime > wave.timeGap)) {

            if (now - wave.lastIntervalTime > wave.interval) {

                if (wave != waveArray[0] && int < wave.count) {
                    if (wave.waveType == 1) {
                        groupNum = groupNum + 1;
                        if (groupNum >= 6) {
                            groupNum = 0;
                        }
                        var s = 0;
                        while (s < 5) {

                            var x = randomInteger(0, 1);
                            if (x == 0) {
                                createEnemies(screenWidth, s / 5 * (screenHeight - 200) + 200, -200, 0, ENEMY_IMAGE, "straight", "group", "black", 1);
                                var enemy = enemyArray[length(enemyArray) - 1];
                                enemy.groupNum = groupNum;
                            } else {
                                createEnemies(screenWidth, s / 5 * (screenHeight - 200) + 200, -200, 0, ENEMY_IMAGE_2, "straight", "group", "white", 1);
                                var enemy = enemyArray[length(enemyArray) - 1];
                                enemy.groupNum = groupNum;
                            }
                            s++;
                        }


                    } else if (wave.waveType == 2) {
                        var x = randomInteger(0, 1);
                        var y = randomInteger(0, 5);
                        if (x == 0) {
                            createEnemies(screenWidth, screenHeight * 0.85 - 100 * y, -200, 0, ENEMY2_IMAGE_BLACK, "normal", "flip", "black", 3);
                            createEnemies(screenWidth, screenHeight / 4 + 25 * y, -200, 0, ENEMY2_IMAGE_WHITE, "normal", "flip", "white", 3);
                        } else {
                            createEnemies(screenWidth, screenHeight * 0.85 - 100 * y, -200, 0, ENEMY2_IMAGE_WHITE, "normal", "flip", "white", 3);
                            createEnemies(screenWidth, screenHeight / 4 + 25 * y, -200, 0, ENEMY2_IMAGE_BLACK, "normal", "flip", "black", 3);
                        }

                    } else if (wave.waveType == 3) {
                        var x = randomInteger(0, 1);
                        var y = randomInteger(0, 5);
                        if (x == 0) {
                            createEnemies(screenWidth, screenHeight * 0.85 - 75 * y, -300, 0, ENEMY2_IMAGE_BLACK, "normal", "flip", "black", 3);
                            createEnemies(screenWidth, screenHeight * 0.70 - 50 * y, -300, 0, ENEMY2_IMAGE_BLACK, "normal", "flip", "black", 3);
                            createEnemies(screenWidth, screenHeight * 0.25 + 30 * y, -300, 0, ENEMY2_IMAGE_WHITE, "normal", "flip", "white", 3);
                        } else {
                            createEnemies(screenWidth, screenHeight * 0.75 - 75 * y, -300, 0, ENEMY2_IMAGE_WHITE, "normal", "flip", "white", 3);
                            createEnemies(screenWidth, screenHeight * 0.5 - 50 * y, -300, 0, ENEMY2_IMAGE_WHITE, "normal", "flip", "white", 3);
                            createEnemies(screenWidth, screenHeight * 0.25 + 30 * y, -300, 0, ENEMY2_IMAGE_BLACK, "normal", "flip", "black", 3);
                        }

                    } else if (wave.waveType == 4) {
                        createEnemies(2000, screenHeight / 2, -X_BASE_SPEED * 2, 0, BOSS2_IMAGE_BLACK, "boss1", "boss1", "black", 40);
                        var enemy = enemyArray[length(enemyArray) - 1];
                        enemy.width = 400;
                        enemy.height = 400;
                    } else if (wave.waveType == 5) {
                        var s = 0;
                        while (s < 30) {
                            createEnemies(screenWidth / 2, 1920 * s / 30, 0, 0, ENEMY_IMAGE, "dummy", "dummy", "black", 9999);
                            s++
                        }
                        createEnemies(screenWidth / 2, screenHeight / 2, 0, -X_BASE_SPEED / 2, BOSS1_IMAGE_WHITE, "boss2", "boss2", "white", 80);
                        player[1].image = PLAYER_IMAGE_BLACK_2
                        var enemy = enemyArray[length(enemyArray) - 1];
                        enemy.width = 400;
                        enemy.height = 400;
                        player[1].position.x = screenWidth / 1.25;
                        player[1].position.y = screenHeight / 2;
                        player[1].inverse = true;
                        player[0].position.x = 200;
                        player[0].position.y = screenHeight / 2;
                        enemy.lastTorpedoTime = currentTime() + 4;

                    } else if (wave.waveType == 6) {
                        var y = randomInteger(1, 5);
                        createEnemies(screenWidth, y / 6 * screenHeight, -100, 0, ENEMY3_IMAGE_BLACK, "dummy", "homing", "black", 5);
                        createEnemies(screenWidth, screenHeight - y / 6 * screenHeight, -100, 0, ENEMY3_IMAGE_WHITE, "dummy", "homing", "white", 5);
                    } else if (wave.waveType == 7) {
                        var x = randomInteger(1, 5);
                        var y = randomInteger(1, 5);
                        createEnemies(screenWidth, y / 6 * screenHeight, -100, 0, ENEMY3_IMAGE_BLACK, "dummy", "homing", "black", 3);
                        createEnemies(screenWidth, screenHeight - y / 6 * screenHeight, -100, 0, ENEMY3_IMAGE_WHITE, "dummy", "homing", "white", 3);
                        createEnemies(0, x / 6 * screenHeight, -100, 0, ENEMY3_IMAGE_WHITE, "dummy", "homing", "white", 3);
                        createEnemies(0, screenHeight - x / 6 * screenHeight, -100, 0, ENEMY3_IMAGE_BLACK, "dummy", "homing", "black", 3);
                    }

                    wave.lastIntervalTime = currentTime();
                    int++;
                } else {
                    if (!wave.isGateway || length(enemyArray) == 0) {
                        waveNum = waveNum + 1
                        if (waveNum < length(waveArray)) {
                            waveArray[waveNum].lastGapTime = now;
                            int = 0;
                        }
                    }
                }
            }
        }
        if (waveNum == level.num && length(enemyArray) == 0 && !lose) {
            if (now - levelPauseTime > 1) {
                levelNum = levelNum + 1;
                var t = 0;
                if (levelNum < length(levelArray)) {
                    levelArray[levelNum].lastGapTime = now;
                    levelStopTime = now;
                } else {
                    victory = true;
                }
                while (t < 2) {
                    player[t].position.x = screenWidth / 5;
                    player[t].position.y = screenHeight / 3 + 250 * t;
                    t++;
                }
                if (levelNum == 4 || levelNum == 5 || victory) {
                    stopSound(MAIN_MUSIC);
                    stopSound(BOSS_MUSIC_1);
                    stopSound(BOSS_MUSIC_2);
                    stopSound(VICTORY_MUSIC);
                    music_last_time = 0;
                }
                enemyTorpedoArray.length = 0;
            }

        } else {
            levelPauseTime = now;
        }
    }
}


// Handles hitboxes.

function doPhysics() {
    var t = 0;

    while (t < length(enemyTorpedoArray)) {

        torpedo = enemyTorpedoArray[t];


        var num = 0;
        while (num < length(player)) {
            var kami = player[num];
            if (kami.alive) {
                if (overlapsPlayer(torpedo.position.x, torpedo.position.y, 5, 5, kami)) {
                    if ((kami.color == 0 && torpedo.colorType == "black") || (kami.color == 1 && torpedo.colorType == "white")) {
                        if (!godMode) {
                            player[0].alive = false;
                            player[1].alive = false;
                            lose = true;
                        }
                        removeAt(enemyTorpedoArray, t);
                    } else if ((kami.color == 0 && torpedo.colorType == "white") || (kami.color == 1 && torpedo.colorType == "black")) {
                        removeAt(enemyTorpedoArray, t);
                    }
                }
            }
            num++;
        }
        t++;
    }

    t = 0;

    while (t < length(enemyArray)) {

        enemy = enemyArray[t];
        num = 0
        while (num < length(player)) {
            kami = player[num]
            if (kami.alive) {
                if (overlapsPlayer(enemy.position.x, enemy.position.y, 5, 5, kami)) {
                    if (!godMode) {
                        player[1].alive = false;
                        player[0].alive = false;
                        lose = true;
                    }
                    if (enemy.hp != 0) {
                        enemy.hp = enemy.hp - 1;
                    } else {
                        removeAt(enemyArray, t);
                    }
                }
            }
            num++
        }

        var s = 0;

        while (s < length(torpedoArray)) {

            torpedo = torpedoArray[s];
            num = 0
            while (num < length(player)) {
                var kami = player[num];
                if (kami.alive) {
                    if (overlapsPlayer(torpedo.position.x, torpedo.position.y, 5, 5, kami)) {
                        if ((kami.color == 0 && torpedo.colorType == "black") || (kami.color == 1 && torpedo.colorType == "white")) {
                            if (!godMode) {
                                player[0].alive = false;
                                player[1].alive = false;
                                lose = true;
                            }
                            removeAt(torpedoArray, s);
                        } else if ((kami.color == 0 && torpedo.colorType == "white") || (kami.color == 1 && torpedo.colorType == "black")) {
                            removeAt(torpedoArray, s);
                        }
                    }
                }
                num++;
            }
            if (overlaps(torpedo.position.x, torpedo.position.y, 5, 5, enemy)) {
                if ((torpedo.colorType == "black" && enemy.colorType == "white") || (torpedo.colorType == "white" && enemy.colorType == "black")) {
                    removeAt(torpedoArray, s);
                    if (enemy.hp != 0) {
                        enemy.hp = enemy.hp - 1;
                        if (enemy.bulletPattern == "boss2") {
                            enemy.lastFlipTime = enemy.lastFlipTime + 1;
                        }
                    } else {
                        if (enemy.bulletPattern == "boss1" && enemy.colorType == "black") {
                            createEnemies(enemy.position.x, enemy.position.y, 0, 300, BOSS2_IMAGE_WHITE, "boss1", "boss1", "white", 20);
                            var enemyBoss1 = enemyArray[length(enemyArray) - 1];
                            enemyBoss1.width = 400;
                            enemyBoss1.height = 400;
                        } else if (enemy.bulletPattern == "boss2") {
                            var p = 0;
                            var q = 0;
                            while (p < length(enemyArray)) {
                                var enemy2 = enemyArray[p];
                                if (enemy2.bulletPattern == "boss2") {
                                    q = q + 1;
                                }
                                p++;
                            }
                            if (q == 1) {
                                p = 0;
                                while (p < length(enemyArray)) {
                                    enemy2 = enemyArray[p];
                                    removeAt(enemyArray, p);
                                }
                            }
                        }
                        removeAt(enemyArray, t);

                    }
                } else {
                    removeAt(torpedoArray, s);
                }
            }
            s++;
        }
        t++;
    }
}

// Runs music
function playMusic() {
    var now = currentTime();
    if (levelNum == 1 || levelNum == 2 || levelNum == 3) {
        if (now - music_last_time > MUSIC_RECHARGE_TIME) { // plays the music on a loop
            playSound(MAIN_MUSIC);
            music_last_time = now;
        }
    } else if (levelNum == 4) {
        if (now - music_last_time > MUSIC_RECHARGE_TIME_2) { // plays the music on a loop
            playSound(BOSS_MUSIC_1);
            music_last_time = now;
        }
    } else if (levelNum == 5 && !victory) {
        if (now - music_last_time > MUSIC_RECHARGE_TIME_3) { // plays the music on a loop
            playSound(BOSS_MUSIC_2);
            music_last_time = now;
        }
    } else if (victory) {
        if (now - music_last_time > MUSIC_RECHARGE_TIME_4) { // plays the music on a loop
            playSound(VICTORY_MUSIC);
            music_last_time = now;
        }
    }
}

function createDPad() {
    // Create the directional pad.  Note that images might not have
    // loaded yet, so we can't refer to their width and height.
    var w = 300;
    var h = 300;

    // Thickness of the active zone.
    var r = min(w, h) / 2.5;

    dpad = makeObject();

    dpad.position = makeObject();
    dpad.position.x = w * 0.75;
    dpad.position.y = screenHeight * 0.75 - h / 2;

    dpad.up = false;
    dpad.dn = false;
    dpad.lt = false;
    dpad.rt = false;
    dpad.up2 = false;
    dpad.dn2 = false;
    dpad.lt2 = false;
    dpad.rt2 = false;

}


// Handles the keys for the directional pad.  Called from onKeyStart
// and onKeyEnd.
function processDPadKey(key, value) {
    if (key == asciiCode("W")) {
        dpad.up = value;
    } else if (key == asciiCode("S")) {
        dpad.dn = value;
    } else if (key == asciiCode("A")) {
        dpad.lt = value;
    } else if (key == asciiCode("D")) {
        dpad.rt = value;
    } else if (key == asciiCode("I")) {
        dpad.up2 = value;
    } else if (key == asciiCode("K")) {
        dpad.dn2 = value;
    } else if (key == asciiCode("J")) {
        dpad.lt2 = value;
    } else if (key == asciiCode("L")) {
        dpad.rt2 = value;
    } else if (key == asciiCode("R")) { //resets the game if it is won or lost
        if (lose || victory) {

            enemyArray.length = 0;
            torpedoArray.length = 0;
            enemyTorpedoArray.length = 0;

            waveNum = 0;
            levelNum = 0;
            int = 0;
            score = 10000;

            stopSound(VICTORY_MUSIC);
            stopSound(MAIN_MUSIC);
            stopSound(BOSS_MUSIC_1);
            stopSound(BOSS_MUSIC_2);
            music_last_time = 0;

            victory = false;
            lose = false;

            var t = 0;
            var kami;
            while (t < 2) {
                kami = player[t];
                kami.position.x = screenWidth / 5;
                kami.position.y = screenHeight / 3 + 250 * t;
                kami.alive = true;
                kami.inverse = false;
                t++
            }

            bossBulletNum = 0;
            groupNum = 0;
            player[1].image = PLAYER_IMAGE_BLACK;
            BACK_X = 0;
            BACK_X_2 = 5758;

        }

    } else if (key == asciiCode("G")) { // restarts the level if lost
        if (lose) {

            enemyArray.length = 0;
            enemyTorpedoArray.length = 0;
            torpedoArray.length = 0;
            var t = 0;
            var kami;
            while (t < 2) {
                kami = player[t];
                kami.position.x = screenWidth / 5;
                kami.position.y = screenHeight / 3 + 250 * t;
                kami.alive = true;
                kami.inverse = false;
                t++
            }

            waveNum = levelArray[levelNum - 1].num;
            int = 0;
            victory = false;
            lose = false;

            player[1].image = PLAYER_IMAGE_BLACK;
            if (score != 0) {
                score = score - 100;
            }

            bossBulletNum = 0;
            groupNum = 0;

            BACK_X = 0;
            BACK_X_2 = 5758;
        }
    }

}

// calculate gradientX for enemy shooting directions
function applyGradX(shooter, receiver) {
    return ((receiver.position.x - shooter.position.x) / // horizontal distance / gradient
        Math.sqrt(abs(receiver.position.x - shooter.position.x) * abs(receiver.position.x - shooter.position.x) + abs(receiver.position.y - shooter.position.y) * abs(receiver.position.y - shooter.position.y)))

}

// calculate gradientY for enemy shooting directions

function applyGradY(shooter, receiver) {
    return ((receiver.position.y - shooter.position.y) / // horizontal distance / gradient
        Math.sqrt(abs(receiver.position.x - shooter.position.x) * abs(receiver.position.x - shooter.position.x) + abs(receiver.position.y - shooter.position.y) * abs(receiver.position.y - shooter.position.y)))

}

// Compute velocity based on the controls
function applyControls() {
    var vx = 0;
    var vy = 0;
    var vx2 = 0;
    var vy2 = 0
    var magnitude;
    var magnitude2;

    if (dpad.lt && !dpad.rt) {
        vx = -1;
    } else if (dpad.rt && !dpad.lt) {
        vx = +1;
    }

    if (dpad.up && !dpad.dn) {
        vy = -1;
    } else if (dpad.dn && !dpad.up) {
        vy = +1;
    }
    if (dpad.lt2 && !dpad.rt2) {
        vx2 = -1;
    } else if (dpad.rt2 && !dpad.lt2) {
        vx2 = +1;
    }

    if (dpad.up2 && !dpad.dn2) {
        vy2 = -1;
    } else if (dpad.dn2 && !dpad.up2) {
        vy2 = +1;
    }


    // Don't let diagonal velocity exceed SPEED.

    // Distance formula:
    magnitude = sqrt(vx * vx + vy * vy);
    magnitude2 = sqrt(vx2 * vx2 + vy2 * vy2);

    if (magnitude > 0) {
        player[0].velocity.x = PLAYER_SPEED * vx / magnitude;
        player[0].velocity.y = PLAYER_SPEED * vy / magnitude;
    } else {
        player[0].velocity.x = 0;
        player[0].velocity.y = 0;
    }
    if (magnitude2 > 0) {
        player[1].velocity.x = PLAYER_SPEED * vx2 / magnitude2;
        player[1].velocity.y = PLAYER_SPEED * vy2 / magnitude2;
    } else {
        player[1].velocity.x = 0;
        player[1].velocity.y = 0;
    }
}

// move player.
function movePlayer(time) {
    // Move the player
    var t = 0;
    while (t < 2) {
        player[t].position.x = player[t].position.x + player[t].velocity.x * time;
        player[t].position.y = player[t].position.y + player[t].velocity.y * time;

        // Keep it on screen
        player[t].position.x =
            min(max(player[t].width / 2, player[t].position.x),
                screenWidth - player[t].width / 2);

        player[t].position.y =
            min(max(player[t].height / 2, player[t].position.y),
                screenHeight - player[t].height / 2);
        t++;
    }
}

// handles the loading of all images.
function drawScreen() {
    var t = 0;
    var torpedo;


    // Space background
    if (!game_start) {
        drawImage(INSTRUCTIONS);
    }
    if (game_start) {
        if ((player[1].alive && player[0].alive) && victory) { // Win game if score is more than or equal to 75
            drawImage(WIN_IMAGE, 0, 0, screenWidth, screenHeight);
        }

        var now = currentTime();
        drawBackground();

        // Draw torpedos under the kami
        while (t < length(torpedoArray)) {
            torpedo = torpedoArray[t];
            drawCentered(torpedo);
            t++;
        }

        t = 0

        // Draw Enemies centered on their current positions
        while (t < length(enemyArray)) {
            enemy = enemyArray[t];
            drawCentered(enemy);
            t++;
        }

        t = 0

        // Draw enemy torpedos
        while (t < length(enemyTorpedoArray)) {
            torpedo = enemyTorpedoArray[t];
            drawCentered(torpedo);
            t++;
        }
        if (godMode) {
            var godText = fillText("GOD MODE",
                screenWidth - SCORE_TEXT_X,
                SCORE_TEXT_Y,
                makeColor(1, 1, 1, 1),
                "bold 80px Times New Roman",
                "center");
        }
        // Draw the player centered on its current position
        if (player[0].alive) {
            drawCentered(player[0]);
        }
        if (player[1].alive) {
            drawCentered(player[1]);
        }
        if (!victory) {
            var scoreText = fillText("Score: " + score,
                SCORE_TEXT_X,
                SCORE_TEXT_Y,
                makeColor(1, 1, 1, 1),
                "bold 80px Times New Roman",
                "center");
        } else { // moves the score text to center bottom if game is won.
            var scoreText = fillText("Score: " + score,
                screenWidth / 2,
                screenHeight / 2 + 600,
                makeColor(1, 1, 1, 1),
                "bold 200px Times New Roman",
                "center");
        }
    }
    if (lose) { // Game over if the kami dies
        drawImage(LOSE_IMAGE, 0, 0, screenWidth, screenHeight);

    }
    if (now - levelStopTime < 3) {
        if (levelNum == 1) {
            drawImage(LEVEL_SCREEN_1, 0, 0, screenWidth, screenHeight);
        } else if (levelNum == 2) {
            drawImage(LEVEL_SCREEN_2, 0, 0, screenWidth, screenHeight);
        } else if (levelNum == 3) {
            drawImage(LEVEL_SCREEN_3, 0, 0, screenWidth, screenHeight);
        } else if (levelNum == 4) {
            drawImage(LEVEL_SCREEN_4, 0, 0, screenWidth, screenHeight);
        } else if (levelNum == 5) {
            drawImage(LEVEL_SCREEN_5, 0, 0, screenWidth, screenHeight);
        }

    }
}

// draws the background
function drawBackground() {
    var now = currentTime();
    if (now - levelStopTime > 1.5) {
        if (levelNum == 1) {
            drawImage(BACKGROUND_IMAGE, BACK_X, BACK_Y, 5758, 1279);
            drawImage(BACKGROUND_IMAGE, BACK_X_2, BACK_Y, 5758, 1279);
        } else if (levelNum == 2) {
            drawImage(BACKGROUND_IMAGE_2, BACK_X, BACK_Y, 5758, 1279);
            drawImage(BACKGROUND_IMAGE_2, BACK_X_2, BACK_Y, 5758, 1279);
        } else if (levelNum == 3) {
            drawImage(BACKGROUND_IMAGE_3, BACK_X, BACK_Y, 5758, 1279);
            drawImage(BACKGROUND_IMAGE_3, BACK_X_2, BACK_Y, 5758, 1279);
        } else if (levelNum == 4) {
            drawImage(BACKGROUND_IMAGE_4, BACK_X, BACK_Y, 5758, 1279);
            drawImage(BACKGROUND_IMAGE_4, BACK_X_2, BACK_Y, 5758, 1279);
        } else if (levelNum == 5) {
            drawImage(BACKGROUND_IMAGE_5, 0, BACK_Y, 2881, 1280);
        }
    }
    BACK_X = BACK_X - 1;
    BACK_X_2 = BACK_X_2 - 1;
    if (BACK_X <= -5758) {
        BACK_X = 5758;
    }
    if (BACK_X_2 <= -5758) {
        BACK_X_2 = 5758;
    }
}

// hitbox for enemies
function overlaps(x, y, width, height, obstacle) {
    return (
        ((x + width / 2) > (obstacle.position.x - obstacle.width / 2.5)) &&

        ((x - width / 2) < (obstacle.position.x + obstacle.width / 2.5)) &&

        ((y + height / 2) > (obstacle.position.y - obstacle.height / 2.5)) &&

        ((y - height / 2) < (obstacle.position.y + obstacle.height / 2.5)));
}

// hitbox for players
function overlapsPlayer(x, y, width, height, obstacle) {
    return (
        ((x + width / 2) > (obstacle.position.x - obstacle.width / 5)) &&

        ((x - width / 2) < (obstacle.position.x + obstacle.width / 5)) &&

        ((y + height / 2) > (obstacle.position.y - obstacle.height / 5)) &&

        ((y - height / 2) < (obstacle.position.y + obstacle.height / 5)));
}

// Draw an object that thas position and image fields.  Note that we
// can apply this to multiple kinds of objects (e.g., the dpad and the
// player) as long as they have those properties.
function drawCentered(object) {
    drawImage(object.image,
        object.position.x - object.width / 2,
        object.position.y - object.height / 2, object.width, object.height);

}