Mix.define('Planet', ['List', 'Unit', 'Draw'], {
    extend:'Entity',
    static_skills:{
        1:{maxUnits:10, productivity:3, upgradeTime:3},
        2:{maxUnits:20, productivity:2, upgradeTime:3},
        3:{maxUnits:30, productivity:2, upgradeTime:3},
        4:{maxUnits:40, productivity:1, upgradeTime:3},
        5:{maxUnits:50, productivity:1, upgradeTime:0}
    },
    static_states:{
        normal:0,
        upgrade:1,
        war:2
    },
    state:0,
    productivity:1, //продуктивность планеты: кол-во секунд через которое рождается один юнит
    countUnits:0, //текущее количество юнитов на планете
    maxUnits:50, //максимальное кол-во юнитов
    owner:null, //владелец планеты - объект класса Player
    changeStateDuration:5000,
    changeStateStart:0,
    level:1,
    maxLevel:5,
    targets:new List(),
    init:function (x, y, game) {
        x = (x + 0.5) | 0;
        y = (y + 0.5) | 0;
        this._super(x, y, game);
        this.color = 'gray';
        this.r = 20;
        this.type = Game.entityType.planet;
        this.maxUnits = Planet.skills[this.level].maxUnits;//game.rnd(10, 20);
        this.productivity = Planet.skills[this.level].productivity;//game.rnd(1, 3);
        this.countUnits = game.rnd(1, this.maxUnits / 3);
        this.posUpgrade = new Vector(this.pos.x + this.r, this.pos.y - this.r);
        this.posLevel = new Vector(this.pos.x - this.r, this.pos.y - this.r);
        this.game.map.add(this);
        //console.log('countUnits: ' + this.countUnits + ', productivity: ' + this.productivity);
        this.restartTimerProductivity(false);

        //debug
        //this.changeState(Planet.states.upgrade);
    },
    changeState:function (state) {
        this.state = state;
        this.changeStateStart = new Date().getTime();
    },
    send:function () {
        var me = this;
        this.targets.each(function () {
            var units = Math.floor(me.countUnits / 2);
            if (me.countUnits - units >= 0 && units > 0) {
                if (me != this) {
                    me.countUnits -= units;
                    var unit = new Unit(me, this, units, me.game);
                    me.game.entities.add(unit.id, unit);
                }
            }
        });
        this.targets.clear();
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
    drawLevel:function () {
        Draw.text(this.posLevel, this.level, '#FFFFFF');
    },
    upgrade:function () {
        if (this.level < this.maxLevel) {
            this.level++;
            this.maxUnits = Planet.skills[this.level].maxUnits;//game.rnd(10, 20);
            this.productivity = Planet.skills[this.level].productivity;//game.rnd(1, 3);
            this.restartTimerProductivity(false);
            this.changeState(Planet.states.normal);
        }
    },
    drawUpgrade:function () {
        Draw.circle(this.posUpgrade, 5, this.color);
    },
    drawUpgradeProcess:function () {
        var now = new Date().getTime(),
            pi2 = Math.PI * 2,
            p = (now - this.changeStateStart) * pi2 / this.changeStateDuration;
        if (this.changeStateStart + this.changeStateDuration <= now) {
            this.upgrade();
        }

        Draw.arc(this.pos, this.r + 5, '#00FF00', 5, 0, p);

    },
    render:function () {
        if (this.isSelect) {
            Draw.arc(this.pos, this.r + 5, '#0000FF', 10);
        }

        if (this.owner) {
            var me = this,
                planets = this.game.map.selectAround(this.pos.x, this.pos.y, 3, Game.entityType.planet);
            planets.each(function () {
                if (this.owner == me.owner) {
                    var ctx = Game.context;
                    ctx.lineWidth = 0.1;
                    ctx.strokeStyle = this.color;
                    ctx.beginPath();
                    ctx.moveTo(me.pos.x, me.pos.y);
                    ctx.lineTo(this.pos.x, this.pos.y);
                    ctx.closePath();
                    ctx.stroke();
                }
            });
        }

        Draw.circle(this.pos, this.r, this.color);
        Draw.text(this.pos, this.countUnits, '#000000', 'center');

        this.drawLevel();
        //this.drawUpgrade();
        switch (this.state) {
            case Planet.states.upgrade:
                this.drawUpgradeProcess();
                break;
        }
    },
    onMouseClick:function (e) {
    },
    onMouseDbClick:function (e) {
    }


});