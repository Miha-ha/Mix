Mix.define('Unit', {
    extend:'Entity',
    count:0,
    speed:0.7,
    init:function (from, to, count, game) {
        this._super(from.x, from.y, game);
        this.color = from.color;
        this.from = from;
        this.to = to;
        this.count = count;

        //вычисляю вектор скорости
        var tvx = to.x - from.x;
        var tvy = to.y - from.y;
        var l = Math.sqrt(tvx * tvx + tvy * tvy);
        this.speedX = this.speed * tvx / l;
        this.speedY = this.speed * tvy / l;
    },
    update:function () {
        if (this.x < this.to.x) this.x += this.speedX;
        if (this.x > this.to.x) this.x -= this.speedX;
        if (this.y < this.to.y) this.y += this.speedY;
        if (this.y > this.to.y) this.y -= this.speedY;
    },
    render:function () {
        var x = (this.x + 0.5) | 0,
            y = (this.y + 0.5) | 0,
            r = 10,
            ctx = this.game.ctx;


        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.count, x, y);
        ctx.stroke();
    }

});