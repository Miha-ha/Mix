Mix.define('Unit', {
    extend: 'Entity',
    init:function (x, y, game) {
        this._super(x, y, game);
        this.color = 'rgba(255, 0, 0, 255)';
    },
    update:function () {
    },
    render:function () {
        var x = (this.x + 0.5) | 0,
            y = (this.y + 0.5) | 0,
            r = 10,
            ctx = this.main.ctx;


        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

});