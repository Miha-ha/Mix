Mix.define('Circle', {
    init:function (x, y, r, main) {
        var ctx = main.ctx;
        this.main = main;

        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 10;


        this.color = 'rgba(' + main.rnd(0, 255) + ',' + main.rnd(0, 255) + ',' + main.rnd(0, 255) + ', 255)';

    },
    update:function () {
        var width = this.main.canvas.width,
            height = this.main.canvas.height;

        this.x += this.dx;
        this.y += this.dy;

        if (this.x <= this.r) {
            this.x = this.r;
            this.dx *= -1;
        } else if (this.x >= width - this.r) {
            this.x = width - this.r;
            this.dx *= -1;
        }

        if (this.y <= this.r) {
            this.y = this.r;
            this.dy *= -1;
        } else if (this.y >= height - this.r) {
            this.y = height - this.r;
            this.dy *= -1;
        }
    },
    render:function () {
        var x = (this.x + 0.5) | 0,
            y = (this.y + 0.5) | 0,
            r = this.r,
            ctx = this.main.ctx;

        //TODO:победить прозрачность при буферизации!
        //ctx.putImageData(this.imgData, x, y);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

});