Mod.define('Size', {
    init:function (width, height) {
        this.width = width;
        this.height = height;
    },
    toString:function () {
        return "{ width:" + this.width + ", height:" + this.height + " }";
    }

});
