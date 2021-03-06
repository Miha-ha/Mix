Mix.define('Circles', ['Circle'], {
    circles: [],
    init: function (count){
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
    },
    update: function (){
        for (var i = 0; i < this.circles.length; ++i) {
            this.circles[i].update();
        }
    },
    render: function (){
//        this.ctx.fillStyle = this.bgcolor;
//        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.circles.length; ++i) {
            this.circles[i].render(this.ctx);
        }

    },
    /*
     var loops = 0, skipTicks = 1000 / Game.fps,
     maxFrameSkip = 10,
     nextGameTick = (new Date).getTime();

     return function() {
     loops = 0;

     while ((new Date).getTime() > nextGameTick) {
     updateStats.update();
     Game.update();
     nextGameTick += skipTicks;
     loops++;
     }

     renderStats.update();
     Game.draw();
     };
     */
    run: function (){
        var me = this,
            loops = 0,
            skipTicks = 33, // ~1000/30
            nextGameTick = (new Date()).getTime(),
            start = nextGameTick,
            frames = 0,
            countLoops = 0;

        var loop = function (){
            loops = 0;
            frames++;
            while ((new Date).getTime() > nextGameTick) {
                me.update();
                nextGameTick += skipTicks;
                loops++;
            }

            //debug
            if (new Date().getTime() - start > 1000) {
                countLoops += loops;
                console.log(loops, loops / frames);
                start = new Date().getTime();
            }

            me.render();
            requestAnimFrame(loop);
        };

        loop();
    },
    runFixStep: function (){
        var me = this,
            t = 0,
            dt = 1000 / 100,
            currentTime = new Date().getTime(),
            start = currentTime,
            accumulator = 0;

        var loop = function (){

            var newTime = new Date().getTime(),
                frameTime = newTime - currentTime,
                loops = 0,
                testFrameTime = frameTime;

            if (frameTime > 25) frameTime = 25;

            currentTime = newTime;
            accumulator += frameTime;

            while (accumulator >= dt) {
                me.update();
                t += dt;
                accumulator -= dt;
                loops++;
            }

            //debug
            if (new Date().getTime() - start > 1000) {
                console.log('Циклов:', loops, 'Время кадра:', testFrameTime);
                start = new Date().getTime();
            }

            me.render();
            requestAnimFrame(loop);
        };

        loop();
    },
    rnd: function (min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});
