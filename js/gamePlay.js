
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

        // data
        this.gameLife = 3;
        this.gameTime = 90;
    },
    create: function(){
        // background & footer
        this.map1Map = this.add.tileSprite(0, 0, cw, ch, 'map1_bg').setOrigin(0);
        this.map2Map = this.add.tileSprite(0, 0, cw, ch, 'map2_bg').setOrigin(0).visible = false;
        this.map3Map = this.add.tileSprite(0, 0, cw, ch, 'map3_bg').setOrigin(0).visible = false;
        this.map1Rock = this.add.tileSprite(0, 768, cw, 215, 'map1_rock').setOrigin(0, 1);
        this.map2Rock = this.add.tileSprite(0, 768, cw, 233, 'map2_rock').setOrigin(0, 1).visible = false;
        this.map3Rock = this.add.tileSprite(0, 768, cw, 167, 'map3_rock').setOrigin(0, 1).visible = false;

        // status
        this.add.image(50, 43.86, 'icon_turtle_life').setOrigin(0);
        this.add.image(144, 64.5, 'cross').setOrigin(0);
        this.add.image(1231, 33, 'icon_time_bubble').setOrigin(0);
        this.btnHint = this.add.image(1166, 49, 'btn_hint').setOrigin(0).setInteractive();
        this.btnHint.on('pointerup', () => {
            this.dialogHint.visible = true;
        });
        this.add.text(185, 56, this.gameLife, { color: '#707070', fontSize: '40px', fontStyle: 'bold', fontFamily: 'Roboto'});
        this.add.text(1250, 55, getDecXX(this.gameTime, 2), { color: '#FFFFFF', fontSize: '40px', fontStyle: 'bold', fontFamily: 'Roboto'});

        // hint dialog
        this.bgHint = this.add.image(0, 0, 'bgHint').setOrigin(0);
        this.btnClose = this.add.image(816.5, 30.5, 'cross').setOrigin(0).setInteractive();
        this.btnClose.on('pointerup', () => {
            this.dialogHint.visible = false;
        });
        this.dialogHint = this.add.container(437, 54, [this.bgHint, this.btnClose]);
        this.dialogHint.visible = false;
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
