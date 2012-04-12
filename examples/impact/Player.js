Mix.define('Player', ['Unit'], {
    selected:[],
    init:function (type, game) {
        this.type = type; //HUMAN or COMP
        this.game = game;
        this.color = 'rgb(' + game.rnd(0, 255) + ',' + game.rnd(0, 255) + ',' + game.rnd(0, 255) + ')';
        if (this.type == 'HUMAN') {
            this.color = '#FF0000';
        }
    },
    sendTo:function (planet) {
        var i,
            l = this.selected.length,
            sendersCount = 0;
        if (l == 0) return;

        for (i = 0; i < l; ++i) {
            var cur = this.selected[i],
                units = Math.floor(cur.countUnits / 2 + 0.5);

            if (cur.countUnits - units >= 0 && units > 0) {
                if (cur != planet) {
                    sendersCount++;
                    cur.countUnits -= units;
                    this.game.entities.push(new Unit(cur, planet, units, this.game));
                }
            }
        }

        if (sendersCount > 0)
            this.unselectPlanets();
    },
    selectPlanet:function (planet, flag) {
        //if (planet.isSelect == flag) return;

        if (planet.owner == this) {
            if (planet.owner.type == 'HUMAN')
                planet.select(flag);
            if (flag) {
                this.selected.push(planet);
            } else {
                var ind = this.selected.indexOf(planet);
                this.selected.splice(ind, 1);//TODO: избавиться от splice
            }
        } else {
            this.sendTo(planet);
        }
    },
    unselectPlanets:function () {
        //снимаю выделение
        for (var i = this.selected.length - 1; i > -1; i--) {
            this.selectPlanet(this.selected[i], false);
//            this.selected.splice(i, 1);
        }
        console.log('Выделение снято: ' + (this.selected.length == 0));
        this.selected = [];
        console.log(this.selected);
    },
    countForwards:function () {
        var count = 0;
        for (var i = 0, l = this.selected.length; i < l; ++i) {
            count += this.selected[i].countUnits;
        }
        return count / 2;
    }



});