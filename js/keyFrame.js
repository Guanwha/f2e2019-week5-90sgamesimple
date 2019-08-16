const keyFrame = (self) => {
  console.log(self.anims);
  self.anims.create({
    key: 'swim',
    frames: self.anims.generateFrameNumbers('turtle', { start: 0, end: 1 }),
    frameRate: 5,
    repeat: -1
  });
  self.anims.create({
    key: 'speed',
    frames: self.anims.generateFrameNumbers('turtle', { start: 2, end: 3 }),
    frameRate: 7,
    repeat: -1
  });
  self.anims.create({
    key: 'hurt',
    frames: self.anims.generateFrameNumbers('turtle', { start: 4, end: 4 }),
    duration: cHurtDuration,
    repeat: 0
  });
  self.anims.create({
    key: 'dead',
    frames: self.anims.generateFrameNumbers('turtle', { start: 5, end: 5 }),
    frameRate: 1,
    repeat: 0
  });
}