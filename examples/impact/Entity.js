Mix.define('Entity', {
    isSelect:false,
    isKilled:false,
    init:function (x, y, game) {
        this.x = x;
        this.y = y;
        this.game = game;
    },
    update:function () {
    },
    render:function () {
    },
    select:function (flag) {
        this.isSelect = flag;
    },
    kill:function () {
        var ind = this.game.entities.indexOf(this);
//        this.game.fordelete.push(ind);
        this.isKilled = true;
        console.log('Entity c ind=' + ind + ' будет удален!');
    }

});