Mix.define('Player', ['Unit'], {
    init:function (type, game) {
        this.type = type; //HUMAN or COMP
        this.game = game;
        this.color = 'rgb(' + game.rnd(0, 255) + ',' + game.rnd(0, 255) + ',' + game.rnd(0, 255) + ')';
        if (this.type == 'HUMAN') {
            this.color = '#FF0000';
        }
        this.selected = new List();
    },
    sendTo:function (planet) {
        var me = this,
            sendersCount = 0;

        this.selected.each(function () {
            var cur = this,
                units = Math.floor(cur.countUnits / 2 + 0.5);

            if (cur.countUnits - units >= 0 && units > 0) {
                if (cur != planet) {
                    sendersCount++;
                    cur.countUnits -= units;
                    var unit = new Unit(cur, planet, units, me.game);
                    me.game.entities.add(unit.id, unit);
                }
            }
        });

        if (sendersCount > 0)
            this.unselectPlanets();
    },
    selectPlanet:function (planet, flag) {
        if (!planet) return;

        if (planet.owner == this) {
            if (planet.owner.type == 'HUMAN')
                planet.select(flag);
            if (flag) {
                this.selected.add(planet.id, planet);
            } else {
                this.selected.remove(planet.id);
            }
        } else {
            this.sendTo(planet);
        }
    },
    unselectPlanets:function () {
        var me = this;
        this.selected.each(function () {
            me.selectPlanet(this, false);
        });
    },
    countForwards:function () {
        var count = 0;
        this.selected.each(function () {
            count += this.countUnits;
        });
        return Math.floor(count / 2);
    }



});