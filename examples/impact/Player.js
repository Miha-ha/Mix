Mix.define('Player', ['Unit'], {
    selected:[],
    init:function (type, game) {
        this.type = type; //HUMAN or COMP
        this.game = game;
        this.color = '#FFFFFF'; //TODO: добавить случайный выбор из стаблицы цветов
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
                cur.countUnits -= units;
                if (cur != planet) {
                    sendersCount++;
                    this.game.entities.push(new Unit(cur, planet, units, this.game));
                }
            }
        }

        if (sendersCount > 0)
            this.unselectPlanets();
    },
    selectPlanet:function (planet, flag) {
        if (planet.isSelect == flag) return;

        if (planet.owner != this) {
            this.attack(planet);
        } else {
            planet.select(flag);
            if (flag)
                this.selected.push(planet);
            else {
                var ind = this.selected.indexOf(planet);
                this.selected.splice(ind, 1);//TODO: избавиться от splice
            }
        }
    },
    attack:function (planet) {
//        document.getElementById('audioAttack').play();
        var i,
            l = this.selected.length;
        if (l == 0) return;

        for (i = 0; i < l; ++i) {
            var cur = this.selected[i],
                units = Math.floor(cur.countUnits / 2 + 0.5);

            if (cur.countUnits - units >= 0 && units > 0) {
                cur.countUnits -= units;
                this.game.entities.push(new Unit(cur, planet, units, this.game));
            }
        }

        this.unselectPlanets();
    },
    unselectPlanets:function () {
        //снимаю выделение
        for (var i = this.selected.length - 1; i > -1; i--) {
            this.selectPlanet(this.selected[i], false);
        }
        console.log('Выделение снято: ' + (this.selected.length == 0));
        this.selected = [];
        console.log(this.selected);
    }



});