Mix.define('Unit', {
    extend:'Entity',
    length:30,
    speed:0.7,
    init:function (from, to, count, game) {
        this._super(from.pos.x, from.pos.y, game);
        this.color = from.color;
        this.owner = from.owner;
        this.to = to;
        this.length = count;

        //вычисляю вектор скорости
        var tvx = to.pos.x - from.pos.x;
        var tvy = to.pos.y - from.pos.y;
        var l = this.pos.getDistance(to.pos, false);//Math.sqrt(tvx * tvx + tvy * tvy);
        this.vel.x = (this.speed * tvx / l);
        this.vel.y = (this.speed * tvy / l);
    },
    update:function () {
        if (!this._super()) return false;

        //если юниты долетели, то начинаем бой
        if (this.pos.getDistance(this.to.pos, true) < this.to.r * this.to.r) {
            //Проверяем, если планеты принадлежат одному вождю, то высылаем подкреп, иначе война
            if (this.to.owner == this.owner) {
                this.support();
            } else {
                this.war();
            }
            this.kill();
        }
        return true;
    },
    war:function () {
        var goodluck = this.game.rnd(-30, 30); //Коэффициент удачи
//        console.log('Удача ' + goodluck);

        this.length += Math.floor(this.length / 100 * goodluck);
        if (this.length < 0) this.length = 0;

//        console.log('Нападение на противника - нап.:' + this.length + ', оборон.:' + this.to.countUnits);

        var diff = this.to.countUnits - this.length;

        if (diff >= 0) {
            this.to.countUnits = diff;
//            console.log('Поражение :( юнитов осталось ' + this.to.countUnits);
        } else {
            if (this.to.owner)
                this.to.owner.unselectPlanets();
            this.to.countUnits = Math.abs(diff);
            this.to.setOwner(this.owner);
//            console.log('Победа!');
        }

    },
    support:function () {
//        console.log('Подкрепление - было: ' + this.to.countUnits + ', прибыло: ' + this.length);
        this.to.countUnits += this.length;
    },
    render:function () {
        var x = (this.pos.x + 0.5) | 0,
            y = (this.pos.y + 0.5) | 0,
            r = 8,
            ctx = this.game.ctx;

        //ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.length, x, y);
    }


});