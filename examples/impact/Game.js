Mix.define('Game', ['Planet', 'Player'], {
    entities: [],
    init:function (count) {

        this.initGraphics();
    },
    initGraphics: function(){
        this.bgcolor = '#00FFFF';
        this.canvas = document.getElementById('Canvas2D');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.ctx.globalAlpha = 0.5;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        window.addEventListener("resize", this.resize.bind(this), false);
    },
    resize:function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    render:function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.makeForce();
        for (var i = 0; i < this.points.length; ++i) {
            this.points[i].update(this.dt);
            this.points[i].render();
        }
    },
    run:function () {
        var me = this;

        var loop = function () {
            me.render();
            requestAnimFrame(loop);
        };
        loop();
    }
});