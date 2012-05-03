Mix.define('Unit', ['List'], {
    extend:'Entity',
    length:30,
    speed:0.7,
    init:function (from, to, count, game) {
        this._super(from.pos.x, from.pos.y, game);
        this.color = from.color;
        this.owner = from.owner;
        this.to = to;
        this.length = count;
        this.type = Game.entityType.unit;

        //вычисляю вектор скорости
        var tvx = to.pos.x - from.pos.x;
        var tvy = to.pos.y - from.pos.y;
        var l = this.pos.getDistance(to.pos, false);//Math.sqrt(tvx * tvx + tvy * tvy);
        this.vel.x = (this.speed * tvx / l);
        this.vel.y = (this.speed * tvy / l);

        //init boids
        this.boids = new List();
        var Boid = function (x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
        };

        for (var i = 0; i < count; ++i) {
            this.boids.add(i, new Boid(from.pos.x + this.game.rnd(-from.r, from.r), from.pos.y + this.game.rnd(-from.r, from.r), this.vel.x, this.vel.y));
        }
    },
    update:function () {
        if (!this._super()) return false;

        var me = this;

        this.boids.each(function () {
            var tvx = me.to.pos.x - this.x;
            var tvy = me.to.pos.y - this.y;
            var l = Math.sqrt(tvx * tvx + tvy * tvy);
            if (l < me.to.r * 3) {
                this.vx = me.speed * tvx / l;
                this.vy = me.speed * tvy / l;
            } else {
                this.vx = me.vel.x;
                this.vy = me.vel.y;
            }
            this.vx += 2 * ( Math.random() - 0.5 ) / 7;
            this.vy += 2 * ( Math.random() - 0.5 ) / 7;

            this.x += this.vx;
            this.y += this.vy;
        });

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
        var r = 8;
        /*
         Draw.circle(this.pos, r, this.color);
         Draw.text(this.pos, this.length, '#000000');
         Draw.text(this.pos.addScalar(r), this.id, this.color, 'left');
         */
        var me = this;
        this.boids.each(function () {
            Draw.rect(this.x, this.y, 2, 2, me.color);
            //return true;
        });
    }


});