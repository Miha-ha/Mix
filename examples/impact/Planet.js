Mix.define('Planet', {
    extend: 'Entity',
    productivity: 1,    //продуктивность планеты: кол-во секунд через которое рождается один юнит
    countUnits: 0,      //текущее количество юнитов на планете
    maxUnits: 10,       //максимальное кол-во юнитов
    owner: null,        //владелец планеты - объект класса Player
    init:function (x, y, game) {
        this._super(x, y, game);
        this.color = 'rgba(255, 0, 0, 255)';
    },
    update:function () {
    },
    render:function () {
        var x = (this.x + 0.5) | 0,
            y = (this.y + 0.5) | 0,
            r = 50,
            ctx = this.main.ctx;

        if(this.isSelect){
            ctx.fillStyle = 'rgba(0, 200, 0, 255)';
            ctx.beginPath();
            ctx.arc(x, y, r*1.2, 0, Math.PI * 2, true);
            ctx.closePath();
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

});