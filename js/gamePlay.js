const tweenMapEase = 'Power4';
const tweenMapDuration = 2000;
const tweenMapChangeTime1 = 88;     // [!!!]
const tweenMapChangeTime2 = 86;     // [!!!]

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

        // player
        this.turtle = this.load.spritesheet('turtle', '../assets/turtlemove.png', { frameWidth: 400, frameHeight: 400});

        // data
        this.gameLife = 3;
        this.gameTime = 90;
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
            this.dialogHint.visible = true;
        });
        this.add.text(185, 56, this.gameLife, { color: '#707070', fontSize: '40px', fontStyle: 'bold', fontFamily: 'Roboto'});
        this.txtTime = this.add.text(1250, 55, getDecXX(this.gameTime, 2), { color: '#FFFFFF', fontSize: '40px', fontStyle: 'bold', fontFamily: 'Roboto'});

        // player
        this.player = this.add.sprite(cw/2, ch/2, 'turtle').setOrigin(295/400, 180/400);    // set the anchor to the turtle's head
        keyFrame(this);
        this.player.anims.play('swim', true);

        // hint dialog
        this.bgHint = this.add.image(0, 0, 'bgHint').setOrigin(0);
        this.btnClose = this.add.image(816.5, 30.5, 'cross').setOrigin(0).setInteractive();
        this.btnClose.on('pointerup', () => {
            this.dialogHint.visible = false;
        });
        this.dialogHint = this.add.container(437, 54, [this.bgHint, this.btnClose]);
        this.dialogHint.visible = false;

        // countdown
        setInterval(() => {
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
        }, 1000);
    },
    update: function(){
        // background & footer movement
        this.map1Rock.tilePositionX += 8;
        this.map2Rock.tilePositionX += 8;
        this.map3Rock.tilePositionX += 8;
    },
}

//====== functions ======
const getDecXX = (num, length) => {
    return (Array(length).join('0') + num).slice(-length);
}
