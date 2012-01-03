Mix.define('Circle', {
    init:function (x, y, r, main) {
        var canvas = main.canvas;
        var ctx = main.canvas.getContext('2d');

        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 10;

        this.dx = this.rnd(-3, 3);
        this.dy = this.rnd(-3, 3);

        this.color = 'rgb(' + this.rnd(0, 255) + ',' + this.rnd(0, 255) + ',' + this.rnd(0, 255) + ')';

        //буферизация
        ctx.fillStyle = main.bgcolor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(r, r, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        this.imgData = ctx.getImageData(0, 0, r * 2, r * 2);
    },
    update:function (width, height) {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= this.r) {
            this.x = this.r;
            this.dx = this.rnd(-5, 5);
        } else if (this.x >= width - this.r) {
            this.x = width - this.r;
            this.dx = this.rnd(-5, 5);
        }

        if (this.y <= this.r) {
            this.y = this.r;
            this.dy = this.rnd(-5, 5);
            ;
        } else if (this.y >= height - this.r) {
            this.y = height - this.r;
            this.dy = this.rnd(-5, 5);
        }
    },
    render:function (ctx) {
        ctx.putImageData(this.imgData, (this.x + 0.5) | 0, (this.y + 0.5) | 0);
    },
    rnd:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});