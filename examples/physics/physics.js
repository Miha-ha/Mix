Mix.define('Physics', ['Point'], {
    points:[],
    init:function (count) {
        this.bgcolor = '#00FFFF';
        this.canvas = document.getElementById('Canvas2D');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.ctx.globalAlpha = 0.5;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var x, y, vx, vy, m, speed = 10;
        while (count--) {
            m = this.rnd(3, 5);
            if (count < 5)
                m = this.rnd(20, 100);
            x = this.rnd(m, this.canvas.width - m);
            y = this.rnd(m, this.canvas.height - m);
            vx = this.rnd(-speed, speed);
            vy = this.rnd(-speed, speed);

            this.points.push(new Point(x, y, vx, vy, m, this));
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
    makeForce:function () {
        var i, j, l, p1, p2, F,
            count = this.points.length;

        for (i = 0; i < count; ++i) {
            this.points[i].fx = 0;
            this.points[i].fy = 0;
        }

        for (i = 0; i < count; ++i)
            for (j = 0; j < count; ++j) {
                if (i == j) continue;

                p1 = this.points[i];
                p2 = this.points[j];
                /*
                 l:=sqrt(sqr(x[i]-x[j])+sqr(y[i]-y[j])); if l<2 then l:=2;
                 F:=-50000*m[i]*m[j]/sqr(l)+500000*m[i]*m[j]/sqr(l*l);
                 Fx[i]:=Fx[i]+F*(x[i]-x[j])/l;
                 Fy[i]:=Fy[i]+F*(y[i]-y[j])/l+m[i]*10;
                 */
                l = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
                if (l < 2) l = 2;
                var t = 500000;
                //F = -t*p1.m*p2.m/(l*l)+t*p1.m*p2.m/(l*l*l*l);
                F = t * p1.m * p2.m / (l * l);
                p1.fx += F * (p1.x - p2.x) / l;
                p1.fy += F * (p1.y - p2.y) / l;//+p1.m*10;

            }
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

        //инициализация физических величин
        this.dt = 0.002;

        var loop = function () {
            me.render();
            requestAnimFrame(loop);
        };

        loop();
    },
    rnd:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});
