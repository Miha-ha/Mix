Mix.define('Draw', ['Vector'], {
    static_rect:function (x, y, width, height, color) {
        var ctx = Game.context;
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.fillRect(x, y, width, height);
        ctx.closePath();
        ctx.fill();
    },

    static_circle:function (pos, r, color) {
        var ctx = Game.context;
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc((pos.x + 0.5) | 0, (pos.y + 0.5) | 0, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    },

    static_arc:function (pos, r, color, lineWidth, angleStart, angleFinish) {
        angleStart = angleStart || 0;
        angleFinish = angleFinish || Math.PI * 2;
        var ctx = Game.context;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc((pos.x + 0.5) | 0, (pos.y + 0.5) | 0, r, angleStart, angleFinish, false);
        //ctx.closePath();
        ctx.stroke();
    },

    static_text:function (pos, text, color, align) {
        align = align || 'center';
        var ctx = Game.context;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';
        ctx.fillText(text, (pos.x + 0.5) | 0, (pos.y + 0.5) | 0);
    }
});