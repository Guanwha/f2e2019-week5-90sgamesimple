const tweenMapEase = 'Power4';
const tweenMapDuration = 2000;
const tweenMapChangeTime1 = 60;     // [!!!]
const tweenMapChangeTime2 = 30;     // [!!!]
const playerMoveUpSpeed = 300;
const playerMoveDownSpeed = 300;
const playerMoveLeftSpeed = 200;
const playerMoveRightSpeed = 200;
const cObjMap = [
    { type: 'enemy',  name: 'enemy1', path: '../assets/enemy_aluminum_can.png'},
    { type: 'enemy',  name: 'enemy2', path: '../assets/enemy_bag.png'},
    { type: 'enemy',  name: 'enemy3', path: '../assets/enemy_baote.png'},
    { type: 'enemy',  name: 'enemy4', path: '../assets/enemy_fishing_net.png'},
    { type: 'healer', name: 'healer', path: '../assets/heal_jellyfish.png'},
];
const cTotalGameTime = 90;                                  // total game time
const cJellyTime = 60;                                      // time for jellyfish appealing
const cFPS = 60;
const cRockMoveSpeed = 8;                                   // pixels each frame (60 frames per second)
const cJellyStartX = cRockMoveSpeed * cFPS * cJellyTime;    // position for jellyfish appealing
const cObjMaxX = cRockMoveSpeed * cFPS * cTotalGameTime;    // obj limit range
const cObjMinX = cw;
const cObjMaxY = ch - 233;
const cObjMinY = 103;
const cMaxDistBetweenObjs = cw;                             // distance range between previous and next object
const cMinDistBetweenObjs = 100;


const gamePlay = {
    key: 'gamePlay',
    preload: function(){
        // background & footer
        this.load.image('map1_bg',   '../assets/map1_bg.png');
        this.load.image('map2_bg',   '../assets/map2_bg.png');
        this.load.image('map3_bg',   '../assets/map3_bg.png');
        this.load.image('map1_rock', '../assets/map1_rock.png');
        this.load.image('map2_rock', '../assets/map2_rock.png');
        this.load.image('map3_rock', '../assets/map3_rock.png');

        // status
        this.load.image('icon_turtle_life', '../assets/icon_turtlelife.png');
        this.load.image('icon_time_bubble', '../assets/icon_timebubble.png');
        this.load.image('btn_hint', '../assets/button_hint2.png');
        
        // hint dialog
        this.load.image('bgHint', '../assets/hint.png');
        this.load.image('cross', '../assets/button_close.png');

        // gameover dialog
        this.load.image('bg_game_over', '../assets/gameover_1.png');
        this.load.image('bg_game_success', '../assets/gameover_2.png');
        this.load.image('btn_restart', '../assets/button_playagain.png');

        // enemy & healer
        for (let i = 0; i < cObjMap.length; i++) {
            this.load.image(cObjMap[i].name, cObjMap[i].path);
        }

        // player
        this.turtle = this.load.spritesheet('turtle', '../assets/turtlemove.png', { frameWidth: 400, frameHeight: 400});

        // control
        this.load.image('icon_mouse_drag', '../assets/icon_mousedown.png');

        // data
        this.gameLife = 3;
        this.gameTime = 90;
        this.down_x = -1;
        this.down_y = -1;
        this.mouseDown = false;
        this.objs = [];             // {} include sprite, collider
        this.isPause = false;
    },
    create: function(){
        // background & footer
        this.map1Map = this.add.image(0, 0, 'map1_bg').setOrigin(0).setAlpha(1);
        this.map2Map = this.add.image(0, 0, 'map2_bg').setOrigin(0).setAlpha(0);
        this.map3Map = this.add.image(0, 0, 'map3_bg').setOrigin(0).setAlpha(0);
        this.map1Rock = this.add.tileSprite(0, 768, cw, 215, 'map1_rock').setOrigin(0, 1).setAlpha(1);
        this.map2Rock = this.add.tileSprite(0, 768, cw, 233, 'map2_rock').setOrigin(0, 1).setAlpha(0);
        this.map3Rock = this.add.tileSprite(0, 768, cw, 167, 'map3_rock').setOrigin(0, 1).setAlpha(0);

        // background & footer' tween
        this.tweenMap1FadeOut = this.tweens.add({
            targets: [this.map1Map, this.map1Rock],
            alpha: 0,
            easeOut: tweenMapEase,
            duration: tweenMapDuration,
            paused: true,
        });
        this.tweenMap2FadeIn = this.tweens.add({
            targets: [this.map2Map, this.map2Rock],
            alpha: 1,
            easeIn: tweenMapEase,
            duration: tweenMapDuration,
            paused: true,
        });
        this.tweenMap2FadeOut = this.tweens.add({
            targets: [this.map2Map, this.map2Rock],
            alpha: 0,
            easeOut: tweenMapEase,
            duration: tweenMapDuration,
            paused: true,
        });
        this.tweenMap3FadeIn = this.tweens.add({
            targets: [this.map3Map, this.map3Rock],
            alpha: 1,
            easeIn: tweenMapEase,
            duration: tweenMapDuration,
            paused: true,
        });

        // status
        this.add.image(50, 43.86, 'icon_turtle_life').setOrigin(0);
        this.add.image(144, 64.5, 'cross').setOrigin(0);
        this.add.image(1231, 33, 'icon_time_bubble').setOrigin(0);
        this.btnHint = this.add.image(1166, 49, 'btn_hint').setOrigin(0).setInteractive();
        this.btnHint.on('pointerup', () => {
            this.dialogHint.visible = true;     // show hint
            this.isPause = true;                // pause
        });
        this.txtLife = this.add.text(185, 56, this.gameLife, { color: '#707070', fontSize: '40px', fontStyle: 'bold', fontFamily: 'Roboto'});
        this.txtTime = this.add.text(1250, 55, getDecXX(this.gameTime, 2), { color: '#FFFFFF', fontSize: '40px', fontStyle: 'bold', fontFamily: 'Roboto'});

        // enemy & healer generator
        generateEnemyHealer(this);

        // player
        this.player = this.physics.add.sprite(cw/2, ch/2, 'turtle').setOrigin(295/400, 180/400);    // set the anchor to the turtle's head
        this.player.name = 'player';
        keyFrame(this);
        this.player.anims.play('swim', true);

        // physics
        this.player.setCollideWorldBounds(true);                    // limite the player action range
        this.player.setCircle(30, 265, 150);                        // player's collider

        //-- enemy & healer
        for (let i=0; i<this.objs.length; i++) {
            this.objs[i].collider = this.physics.add.collider(this.player, this.objs[i].sprite, (obj1, obj2) => {
                // life +/-
                this.gameLife = (obj2.name === 'enemy') ? this.gameLife - 1
                             : ((obj2.name === 'healer') ? this.gameLife + 1 : this.gameLife);
                this.gameLife = (this.gameLife > 5) ? 5 : this.gameLife;                            // max-life is 5
                this.txtLife.setText(this.gameLife);
                if (this.gameLife <= 0) {
                    // game over
                    this.isEnd = true;
                    this.dialogGameOver.visible = true;
                    clearInterval(this.countdownLoop);
                    console.log('game over');
                }

                // when player collide with object, destory the object
                this.objs[obj2.objIdx].collider.destroy();
                this.objs[obj2.objIdx].sprite.visible = false;
            });
        }

        //-- upper bound
        this.upperBound = this.add.tileSprite(0, 0, cw, 103, 'map3_rock').setOrigin(0, 0).setVisible(false);
        this.physics.add.existing(this.upperBound);
        this.physics.add.collider(this.player, this.upperBound);
        this.upperBound.body.immovable = true;
        this.upperBound.body.moves = false;

        //-- lower bound
        this.physics.add.existing(this.map1Rock);
        this.physics.add.collider(this.player, this.map1Rock);
        this.map1Rock.body.immovable = true;
        this.map1Rock.body.moves = false;

        // hint dialog
        this.bgHint = this.add.image(0, 0, 'bgHint').setOrigin(0);
        this.btnClose = this.add.image(816.5, 30.5, 'cross').setOrigin(0).setInteractive();
        this.btnClose.on('pointerup', () => {
            this.dialogHint.visible = false;    // close hint
            this.isPause = false;               // going on
        });
        this.dialogHint = this.add.container(437, 54, [this.bgHint, this.btnClose]);
        this.dialogHint.visible = false;

        // game over dialog
        this.bgGameOver = this.add.image(0, 0, 'bg_game_over').setOrigin(0);
        this.btnRestart = this.add.image(218, 247, 'btn_restart').setOrigin(0).setInteractive();
        this.dialogGameOver = this.add.container(392, 220, [this.bgGameOver, this.btnRestart]).setVisible(false);
        this.btnRestart.on('pointerup', () => {
            this.dialogGameOver.visible = false;
            this.scene.start('gameStart');          // back to the gameStart
        });

        // game success dialog
        this.bgGameSuccess = this.add.image(0, 0, 'bg_game_success').setOrigin(0);
        this.btnRestart = this.add.image(218, 247, 'btn_restart').setOrigin(0).setInteractive();
        this.dialogGameSuccess = this.add.container(392, 220, [this.bgGameSuccess, this.btnRestart]).setVisible(false);
        this.btnRestart.on('pointerup', () => {
            this.dialogGameSuccess.visible = false;
            this.scene.start('gameStart');          // back to the gameStart
        });

        // control
        this.down_center = this.add.image(0, 0, 'icon_mouse_drag').setAlpha(0.5).setVisible(false);
        this.down_dir = this.add.line(0, 0, 0, 0, 100, 100, '0xffffff', 0.5).setOrigin(0).setVisible(false);
        this.input.on('pointerdown', (p) => {
            this.down_x = p.x;
            this.down_y = p.y;
            this.mouseDown = true;
            this.down_center.x = this.down_x;
            this.down_center.y = this.down_y;
            this.down_center.visible = true;
            this.down_dir.visible = true;
        });
        this.input.on('pointermove', (p) => {
            if (!this.mouseDown) return;
            let isSpeed = false;
            let cur_x = p.x;
            let cur_y = p.y;
            this.down_dir.setTo(this.down_x, this.down_y, cur_x, cur_y);
            this.player.setVelocity(0);                                // clear x-direction velocity
            if (cur_y - this.down_y < -25) {
                this.player.setVelocityY(-playerMoveUpSpeed);
                isSpeed = true;
            }
            else if (cur_y - this.down_y > 25) {
                this.player.setVelocityY(playerMoveDownSpeed);
            }
            if (cur_x - this.down_x < -25) {
                this.player.setVelocityX(-playerMoveLeftSpeed);
            }
            else if (cur_x - this.down_x > 25) {
                this.player.setVelocityX(playerMoveRightSpeed);
                isSpeed = true;
            }
            console.log(isSpeed);
            if (isSpeed) {
                this.player.anims.play('speed', true);
            }
            else {
                this.player.anims.play('swim', true);
            }
        });
        this.input.on('pointerup', () => {
            this.down_x = this.down_y = -1;
            this.mouseDown = false;
            this.down_center.visible = false;
            this.down_dir.visible = false;
        });

        // countdown
        this.countdownLoop = setInterval(() => {
            this.gameTime--;
            this.txtTime.setText(getDecXX(this.gameTime, 2));
            if (this.gameTime === tweenMapChangeTime1) {
                this.tweenMap1FadeOut.play();
                this.tweenMap2FadeIn.play();
            }
            else if (this.gameTime === tweenMapChangeTime2) {
                this.tweenMap2FadeOut.play();
                this.tweenMap3FadeIn.play();
            }
            
            // check time
            if (this.gameTime === 0) {
                // game success
                this.isEnd = true;
                this.dialogGameSuccess.visible = true;
                clearInterval(this.countdownLoop);
            }
        }, 1000);

        // start this game
        this.isEnd = false;
    },
    update: function(){
        // check status
        if (this.isEnd || this.isPause) {
            for (let i = 0; i<this.objs.length; i++) {
                this.objs[i].sprite.setVelocityX(0);
            }
            this.player.setVelocity(0);
            return;
        }

        // background & footer movement
        this.map1Rock.tilePositionX += cRockMoveSpeed;
        this.map2Rock.tilePositionX += cRockMoveSpeed;
        this.map3Rock.tilePositionX += cRockMoveSpeed;

        // enemy & healer movement
        for (let i = 0; i<this.objs.length; i++) {
            this.objs[i].sprite.setVelocityX(-cRockMoveSpeed * cFPS);
        }

        // control
        if (!this.mouseDown) {
            let isSpeed = false;
            let keyboard = this.input.keyboard.createCursorKeys();
            this.player.setVelocity(0);                                // clear x-direction velocity
            if (keyboard.up.isDown) {
                this.player.setVelocityY(-playerMoveUpSpeed);
                isSpeed = true;
            }
            else if (keyboard.down.isDown) {
                this.player.setVelocityY(playerMoveDownSpeed);
            }
            if (keyboard.left.isDown) {
                this.player.setVelocityX(-playerMoveLeftSpeed);
            }
            else if (keyboard.right.isDown) {
                this.player.setVelocityX(playerMoveRightSpeed);
                isSpeed = true;
            }
            if (isSpeed) {
                this.player.anims.play('speed', true);
            }
            else {
                this.player.anims.play('swim', true);
            }
        }
    },
}

//====== functions ======
// format number with <length> decimal digits
const getDecXX = (num, length) => {
    return (Array(length).join('0') + num).slice(-length);
}

// generate the enemy & healer array
const generateEnemyHealer = (self) => {
    let curX = cObjMinX;
    let curY = random(cObjMaxY, cObjMinY);
    let objIdx = 0;
    let i = 0;
    while (curX < cObjMaxX) {
        // random object
        objIdx = (curX >= cJellyStartX) ? random(4, 0) : random(3, 0);
        let sprite = self.physics.add.sprite(curX, curY, cObjMap[objIdx].name)
        sprite.name = cObjMap[objIdx].type;
        sprite.objIdx = i;
        let obj = { sprite, collider: null };
        self.objs.push(obj);

        // next position
        i++;
        curX += random(cMaxDistBetweenObjs, cMinDistBetweenObjs);
        curY = random(cObjMaxY, cObjMinY);
    }
    console.log(self.objs);
}

// random number from min to max
const random = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
