Mix.define('Entity', {
    isSelect: false,
    init:function (x, y, game) {
        this.x = x;
        this.y = y;
        this.main = game;
    },
    update:function () {
    },
    render:function () {
    },
    select: function(flag){
        this.isSelect = flag;
    }


});