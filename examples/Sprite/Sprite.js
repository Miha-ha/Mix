Mix.define('Sprite', ['SpriteSheet', 'common:Chain'], {
    sheet: null,
    timer: null,
    chain: null,

    sequence: [],
    flip: {x: false, y: false},
    pivot: {x: 0, y: 0},

    frame: 0,
    tile: 0,
    loopCount: 0,
    alpha: 1,
    angle: 0,


    init: function (sheet, frameTime, sequence, loop){
        this.sheet = sheet;
        this.pivot = {x: sheet.width / 2, y: sheet.height / 2 };

        if (!(sequence instanceof Array)) {
            var countFrames = sequence;
            sequence = [];
            for (var i = 0; i < countFrames; ++i)
                sequence.push(i);

        }

        this.frameTime = frameTime;
        this.sequence = sequence;
        this.tile = this.sequence[0];
        this.frame = 0;

        var me = this;
        this.chain = new Chain(!!loop);
        this.chain.delay(this.frameTime)
            .execute(function (){
                me.gotoFrame(me.frame + 1);
            });
    },


    rewind: function (){
        this.loopCount = 0;
        this.tile = this.sequence[0];
        this.frame = 0;
        return this;
    },


    gotoFrame: function (frame){
        this.frame = frame % this.sequence.length;
        this.tile = this.sequence[ this.frame ];
    },


    gotoRandomFrame: function (){
        this.gotoFrame(Math.floor(Math.random() * this.sequence.length))
    },


    draw: function (ctx, targetX, targetY){
        this.chain.update();
//        var bbsize = Math.max(this.sheet.width, this.sheet.height);

        // On screen?
//        if(
//            targetX > ig.system.width || targetY > ig.system.height ||
//                targetX + bbsize < 0 || targetY + bbsize < 0
//            ) {
//            return;
//        }

        if (this.alpha != 1) {
            ctx.globalAlpha = this.alpha;
        }

        if (this.angle == 0) {
            this.sheet.image.drawTile(ctx,
                targetX, targetY,
                this.tile, this.sheet.width, this.sheet.height,
                this.flip.x, this.flip.y
            );
        }
        else {
            ctx.save();
            ctx.translate(
                targetX + this.pivot.x,
                targetY + this.pivot.y
            );
            ctx.rotate(this.angle);
            this.sheet.image.drawTile(
                -this.pivot.x, -this.pivot.y,
                this.tile, this.sheet.width, this.sheet.height,
                this.flip.x, this.flip.y
            );
            ctx.restore();
        }

        if (this.alpha != 1) {
            ctx.globalAlpha = 1;
        }
    }

});