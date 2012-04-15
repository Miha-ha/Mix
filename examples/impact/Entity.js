Mix.define('Entity', ['Vector'], {
    static_lastId:-1,
    isSelect:false,
    isKilled:false,

    init:function (x, y, game) {
        this.pos = new Vector(x, y);
        this.last = new Vector(x, y);
        this.vel = new Vector(0, 0);
        this.accel = new Vector(0, 0);
        this.game = game;
        this.id = ++Entity.lastId;
    },
    update:function () {
        if (this.isKilled) return false;
        this.last = this.pos.clone();
        this.pos = this.pos.add(this.vel);//TODO: добавить физики
        this.game.map.entityMoved(this); //TODO: реализовать с помощью наблюдателя
        return true;
    },
    render:function () {
    },
    select:function (flag) {
        this.isSelect = flag;
    },
    kill:function () {
        this.isKilled = true;
        this.game.map.entityMoved(this, true); //TODO: реализовать с помощью наблюдателя
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