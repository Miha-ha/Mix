Mod.define('Rectangle', {
    init:function (point, size) {
        this.x = point.x;
        this.y = point.y;
        this.width = size.width;
        this.height = size.height;
//        this.right = this.left + size.width;
//        this.bottom = this.top + size.height;
    },
    toString:function () {
        return "{ x:" + this.x + ", y:" + this.y + ", width: " + this.width + ", height: " + this.height + " }";
    }

});