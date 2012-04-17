Mix.define('Planet', {
    extend:'Entity',
    productivity:1, //продуктивность планеты: кол-во секунд через которое рождается один юнит
    countUnits:0, //текущее количество юнитов на планете
    maxUnits:50, //максимальное кол-во юнитов
    owner:null, //владелец планеты - объект класса Player
    level:1,
    maxLevel:5,
    static_skills:{
        1:{maxUnits:10, productivity:3, upgradeTime:3},
        2:{maxUnits:20, productivity:2, upgradeTime:3},
        3:{maxUnits:30, productivity:2, upgradeTime:3},
        4:{maxUnits:40, productivity:1, upgradeTime:3},
        5:{maxUnits:50, productivity:1, upgradeTime:0}
    },
    init:function (x, y, game) {
        this._super(x, y, game);
        this.color = 'gray';
        this.r = 20;
        this.type = Game.entityType.planet;
        this.maxUnits = Planet.skills[this.level].maxUnits;//game.rnd(10, 20);
        this.productivity = Planet.skills[this.level].productivity;//game.rnd(1, 3);
        this.countUnits = game.rnd(1, this.maxUnits / 3);
        this.game.map.add(this);
        //console.log('countUnits: ' + this.countUnits + ', productivity: ' + this.productivity);
        this.restartTimerProductivity(false);
    },
    restartTimerProductivity:function (stop) {
        if (this.timerProductivity) {
            clearInterval(this.timerProductivity);
            this.timerProductivity = null;
        }
        if (!stop)
            this.timerProductivity = setInterval(this.produce.bind(this), this.productivity * 1000);
    },
    setOwner:function (player) {
        this.owner = player;
        this.color = player.color;
        this.select(false);
    },
    produce:function () {
//        if (!this.owner) return;
        if (this.countUnits < this.maxUnits)
            this.countUnits++;
        else if (this.countUnits > this.maxUnits)
            this.countUnits--;
    },
    update:function () {
    },
    drawLevel:function (ctx) {
//        ctx.strokeStyle = '#FFFFFF';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.level, this.pos.x - this.r, this.pos.y - this.r);
    },
    upgrade:function () {
        if (this.level < this.maxLevel) {
            this.level++;
            this.maxUnits = Planet.skills[this.level].maxUnits;//game.rnd(10, 20);
            this.productivity = Planet.skills[this.level].productivity;//game.rnd(1, 3);
            this.restartTimerProductivity(false);
        }
    },
    drawUpgrade:function (ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x + this.r, this.pos.y - this.r, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    },
    render:function () {
        var x = (this.pos.x + 0.5) | 0,
            y = (this.pos.y + 0.5) | 0,
            ctx = this.game.ctx;

        if (this.isSelect) {
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#0000FF';
            ctx.beginPath();
            ctx.arc(x, y, this.r * 1.2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.stroke();
        }


        ctx.lineWidth = 1;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.countUnits, x, y);

        this.drawLevel(ctx);
        //this.drawUpgrade(ctx);
    },
    onMouseClick:function (e) {
    },
    onMouseDbClick:function (e) {
    }


});