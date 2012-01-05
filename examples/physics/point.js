Mix.define('Point', {
    init:function (x, y, vx, vy, m, main) {
        this.main = main;

        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ax = 0;
        this.ay = 0;
        this.fx = 0;
        this.fy = 0;
        this.m = m;
        this.color = 'rgba(' + main.rnd(0, 255) + ',' + main.rnd(0, 255) + ',' + main.rnd(0, 255) + ', 255)';
    },
    update:function (dt) {
        if (this.m >= 20) return;
        /*
         ax:=Fx[i]/m[i];        ay:=Fy[i]/m[i]; {Вычисление ускорений,}
         vx[i]:=vx[i]+ax*dt;    vy[i]:=vy[i]+ay*dt;  {скоростей,}
         x[i]:=x[i]+vx[i]*dt;   y[i]:=y[i]+vy[i]*dt; {координат}
         if (x[i]<50)or(x[i]>350) then vx[i]:=-vx[i];{отражение}
         if (y[i]<50)or(y[i]>350) then vy[i]:=-vy[i];{от стенок}
         */
        this.ax = this.fx / this.m;
        this.ay = this.fy / this.m;
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x <= this.m) {
            this.x = this.m;
            this.vx *= -1;
        } else if (this.x >= this.main.canvas.width - this.m) {
            this.x = this.main.canvas.width - this.m;
            this.vx *= -1;
        }

        if (this.y <= this.m) {
            this.y = this.m;
            this.vy *= -1;
        } else if (this.y >= this.main.canvas.height - this.m) {
            this.y = this.main.canvas.height - this.m;
            this.vy *= -1;
        }


    },
    render:function () {
        var x = (this.x + 0.5) | 0,
            y = (this.y + 0.5) | 0,
            r = this.m,
            ctx = this.main.ctx;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

});