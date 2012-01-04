Mix.define('Circles', ['Circle'], {
    circles:[],
    init:function (count) {
        this.bgcolor = '#00FFFF';
        this.canvas = document.getElementById('Canvas2D');
        this.ctx = this.canvas.getContext('2d');
//        this.ctx.globalCompositeOperation = "destination-out";
        this.resize();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        while (count > 0) {
            var r = this.rnd(3, 20);
            var x = this.rnd(r, this.canvas.width - r);
            var y = this.rnd(r, this.canvas.height - r);
            this.circles.push(new Circle(x, y, r, this));
            count--;
        }

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
    update:function () {
        for (var i = 0; i < this.circles.length; ++i) {
            this.circles[i].update();
        }
    },
    render:function () {
        this.update();

//        this.ctx.fillStyle = this.bgcolor;
//        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.circles.length; ++i) {
            this.circles[i].render(this.ctx);
        }

        requestAnimFrame(this.render.bind(this));
    },
    run:function () {
        this.render();
    },
    rnd:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});
