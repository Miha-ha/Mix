Mod.define('Point', {
    init:function (x, y) {
        this.x = x;
        this.y = y;
    },
    toString:function () {
        return "(x:" + this.x + "; y:" + this.y + ")";
    }

});