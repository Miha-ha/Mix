Mix.define('Entity', ['Vector'], {
    static_lastId:-1,
    isSelect:false,
    isKilled:false,
    init:function (x, y, game) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(0, 0);
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
    getBounds:function () {
    },
    onMouseMove:function (e) {
    },
    onMouseClick:function (e) {
    },
    onMouseDbClick:function (e) {
    }

});