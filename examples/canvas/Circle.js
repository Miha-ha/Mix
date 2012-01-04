Mix.define('Circle', {
    init:function (x, y, r, main) {
        var ctx = main.ctx;
        this.main = main;

        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 10;

        this.maxSpeed = 5;
        this.dx = this.rnd(-this.maxSpeed-1, this.maxSpeed)+1;
        this.dy = this.rnd(-this.maxSpeed-1, this.maxSpeed)+1;

        this.color = 'rgb(' + this.rnd(0, 255) + ',' + this.rnd(0, 255) + ',' + this.rnd(0, 255) + ')';

        //буферизация
        //TODO:победить прозрачность!
        var r2 = this.r*2;

        ctx.clearRect(0, 0, r2, r2);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(r, r, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        this.imgData = ctx.getImageData(0, 0, r * 2, r * 2);
    },
    update:function () {
        var width = this.main.canvas.width,
            height = this.main.canvas.height;

        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= this.r) {
            this.x = this.r;
            this.dx = this.rnd(-this.maxSpeed - 1, this.maxSpeed) + 1;
        } else if (this.x >= width - this.r) {
            this.x = width - this.r;
            this.dx = this.rnd(-this.maxSpeed - 1, this.maxSpeed) + 1;
        }

        if (this.y <= this.r) {
            this.y = this.r;
            this.dy = this.rnd(-this.maxSpeed - 1, this.maxSpeed) + 1;
        } else if (this.y >= height - this.r) {
            this.y = height - this.r;
            this.dy = this.rnd(-this.maxSpeed - 1, this.maxSpeed) + 1;
        }
    },
    render:function (ctx) {
        ctx.putImageData(this.imgData, (this.x-this.r + 0.5) | 0, (this.y-this.r + 0.5) | 0);
    },
    rnd:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});