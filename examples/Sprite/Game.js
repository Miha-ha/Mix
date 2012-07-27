Mix.define('Game', ['Sprite', 'SpriteSheet'], {
    static_context: null,
    init: function (){
        this.initGraphics();

        var sheetMetaball = new SpriteSheet('metaball.png', 240, 180);

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