Mod.define('Mathematics.Geometry.Point', {
    init:function (x, y) {
        this.x = x;
        this.y = y;
    },
    getDistance:function (point, squared) {
        var x = point.x - this.x,
            y = point.y - this.y,
            g = x * x + y * y;
        return squared ? g : Math.sqrt(g);
    },
    toString:function () {
        return "{ x:" + this.x + ", y:" + this.y + " }";
    }

});