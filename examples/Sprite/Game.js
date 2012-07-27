Mix.define('Game', ['Sprite', 'SpriteSheet'], {
    static_context: null,
    init: function (){
        this.initGraphics();

        var sheetIdle = new SpriteSheet('idle.png', 24, 34);
        var sheetRun = new SpriteSheet('run.png', 22, 36);
        var sheetPinky = new SpriteSheet('pinkyrun.png', 171, 129);
        var sheetMetaball = new SpriteSheet('metaball.png', 240, 180);

        this.spriteIdle = new Sprite(sheetIdle, 400, [0, 1], true);
        this.spriteRun = new Sprite(sheetRun, 100, [0, 1, 2, 3, 4], true);
        this.spritePinkyRun = new Sprite(sheetPinky, 50, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], true);
        this.spriteMetaball = new Sprite(sheetMetaball, 50, 59, true);

    },
    initGraphics: function (){
        this.bgcolor = '#000000';
        this.canvas = document.getElementById('Canvas2D');
        this.ctx = this.canvas.getContext('2d');
        Game.context = this.ctx;//TODO: Заменить все this.ctx на это статическое свойство!
        this.resize();
        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        requestAnimFrame = (function (){
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback, element){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        window.addEventListener("resize", this.resize.bind(this), false);
    },
    resize: function (){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
    },
    render: function (){
        var me = this;
        me.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);


        me.spriteIdle.draw(me.ctx, 100, 100);
        me.spriteRun.draw(me.ctx, 150, 100);
        me.spritePinkyRun.draw(me.ctx, 200, 100);
        me.spriteMetaball.draw(me.ctx, 500, 100);


    },
    run: function (){
        var me = this;

        var loop = function (){
            me.render();
            requestAnimFrame(loop);
        };
        loop();
    },
    onContextMenu: function (e){
        e.stopPropagation();
        e.preventDefault();
    }
});