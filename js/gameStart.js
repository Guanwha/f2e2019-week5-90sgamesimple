
const gameStart = {
    key: 'gameStart',
    preload: function(){
        this.load.image('bg1', './assets/gamecover.png');
        this.load.image('btnPlay', './assets/button_play.png');
        this.load.image('btnHint', './assets/button_hint.png');
        this.load.image('bgHint', './assets/hint.png');
        this.load.image('btnClose', './assets/button_close.png');
    },
    create: function(){
        // game start screen
        this.add.image(0, 0, 'bg1').setOrigin(0);
        this.btnPlay = this.add.image(803, 577, 'btnPlay').setOrigin(0).setInteractive();
        this.btnHint = this.add.image(908, 599, 'btnHint').setOrigin(0).setInteractive();

        // hint dialog
        this.bgHint = this.add.image(0, 0, 'bgHint').setOrigin(0);
        this.btnClose = this.add.image(816.5, 30.5, 'btnClose').setOrigin(0).setInteractive();
        this.dialogHint = this.add.container(437, 54, [this.bgHint, this.btnClose]);
        this.dialogHint.visible = false;

        // interaction
        this.btnPlay.on('pointerup', () => {
          this.scene.start('gamePlay');
        });
        this.btnHint.on('pointerup', () => {
          this.dialogHint.visible = true;
        });
        this.btnClose.on('pointerup', () => {
          this.dialogHint.visible = false;
        });
    },
    update: function(){
    }
}
