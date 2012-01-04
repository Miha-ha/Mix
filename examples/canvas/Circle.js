Mix.define('Circle', {
    init:function (x, y, r, main) {
        var canvas = main.canvas;
        var ctx = main.ctx;

        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 10;

        this.dx = this.rnd(-3, 3);
        this.dy = this.rnd(-3, 3);

        this.color = 'rgb(' + this.rnd(0, 255) + ',' + this.rnd(0, 255) + ',' + this.rnd(0, 255) + ')';

        this.img = main.img;
        //буферизация
//        ctx.clearRect(0, 0, canvas.width, canvas.height);
//        ctx.fillStyle = this.color;
//        ctx.beginPath();
//        ctx.arc(r, r, r, 0, Math.PI * 2, true);
//        ctx.closePath();
//        ctx.fill();
//
//        this.imgData = ctx.getImageData(0, 0, r * 2, r * 2);
    },
    update:function (width, height) {
        this.x += this.dx;
        this.y += this.dy;

        var maxspeed = 10;

        if (this.x <= this.r) {
            this.x = this.r;
            this.dx = this.rnd(-maxspeed - 1, maxspeed) + 1;
        } else if (this.x >= width - this.r) {
            this.x = width - this.r;
            this.dx = this.rnd(-maxspeed - 1, maxspeed) + 1;
        }

        if (this.y <= this.r) {
            this.y = this.r;
            this.dy = this.rnd(-maxspeed - 1, maxspeed) + 1;
        } else if (this.y >= height - this.r) {
            this.y = height - this.r;
            this.dy = this.rnd(-maxspeed - 1, maxspeed) + 1;
        }
    },
    render:function (ctx) {
        //ctx.putImageData(this.imgData, (this.x-this.r + 0.5) | 0, (this.y-this.r + 0.5) | 0);
        ctx.drawImage(this.img, (0.5 + this.x - this.r) | 0, (0.5 + this.y - this.r) | 0);
//        ctx.drawImage(this.img, this.x-this.r, this.y-this.r);
    },
    rnd:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});