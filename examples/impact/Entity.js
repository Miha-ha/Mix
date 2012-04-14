Mix.define('Entity', {
    static_lastId:-1,
    isSelect:false,
    isKilled:false,
    init:function (x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
        this.id = ++Entity.lastId;
    },
    update:function () {
    },
    render:function () {
    },
    select:function (flag) {
        this.isSelect = flag;
    },
    kill:function () {
        this.isKilled = true;
    },
    getDistance:function (entity, squared) {
        var x = entity.x - this.x,
            y = entity.y - this.y,
            g = x * x + y * y;
        return squared ? g : Math.sqrt(g);
    },
    getBounds:function () {
    },
    onMouseMove:function (e) {
    },
    onMouseClick:function (e) {
    },
    onMouseDbClick:function (e) {
    }

});