Mix.define('AI', ['List'], {
    init:function (game) {
        this.game = game;
        this.process();

        setInterval(this.process.bind(this), 3000);
    },
    /**
     * Примерный алгорит выбора цели:
     * каждой планете назначить коэффициент из следующих параметров
     * 0. доступное расстояние!!!
     * 1. countUnits
     * 2. maxUnits
     * 3. productivity
     * 4. среднее расстояние от планет игрока до планеты нападения
     * 5. враг или нейтрал
     * и выбрать планету с лучшим коэфф.
     * @param player
     */
    getTargets:function (player) {
        var targets = new List(),
            countForwards = player.countForwards();
//        this.game.planets.each(function () {
//            var planet = this;
//            //если расстояние от любой планеты нападающих позволяет напасть
//            var distanceOk = false;
//
//            player.selected.each(function () {
//                var d = this.pos.getDistance(planet.pos, false);
//                if (d < 400) {
//                    distanceOk = true;
//                    return false;
//                }
//            });
//
//            if (!distanceOk) return true;
//
//            if (planet.owner != player)
//                target = planet;
//        });

        //перебираю выбранные для атаки планеты
        player.selected.each(function () {
            var attackPlanet = this,
                target = null,
                minT;
            //выбираю доступные для полета планеты
            var targetsTest = this.game.map.selectAround(this.pos.x, this.pos.y, 3, Game.entityType.planet);

            targetsTest.each(function () {
                if (attackPlanet == this || attackPlanet.owner == this.owner)
                    return true;

                var distance = attackPlanet.pos.getDistance(this.pos),
                //супер формула
                    t = this.countUnits * 20 + distance + this.level * 10 + this.productivity * 10;

                if (target && t < minT) {
                    target = this;
                    minT = t;
                }

                if (target == null) {
                    target = this;
                    minT = t;
                }
            });


            if (target) {
                //нападаю
                if (attackPlanet.countUnits > attackPlanet.maxUnits / 2) {
                    attackPlanet.targets.add(target.id, target);
                }
            } else {
                //посылаю подкрепление
                if (attackPlanet.countUnits == attackPlanet.maxUnits) {
                    var minUnits = 99999;
                    targetsTest.each(function () {
                        if (attackPlanet == this || attackPlanet.owner != this.owner)
                            return true;

                        if (this.countUnits < minUnits) {
                            target = this;
                            minUnits = this.countUnits;
                        }
                    });
                    if (target)
                        attackPlanet.targets.add(target.id, target);
                }
            }

            attackPlanet.send();


        });


        return targets;
    },
    /**
     *  Выбрать все планеты у которых больше половины от максимально возможного кол-ва юнитов
     * @param player
     */
    selectForwards:function (player) {
        var ok = false;
        player.unselectPlanets();

        this.game.planets.each(function (index) {
            var planet = this,
                u = Math.floor(planet.maxUnits / 3);

            if (planet.owner == player && planet.countUnits >= u && planet.state == Planet.states.normal) {
                player.selectPlanet(planet, true);
                ok = true;
            }
        });
        return ok;
    },

    upgradePlanets:function (player) {
        this.game.planets.each(function (index) {
            var planet = this;

            if (planet.owner == player && planet.countUnits >= planet.maxUnits && planet.state == Planet.states.normal && planet.level < planet.maxLevel) {
                planet.changeState(Planet.states.upgrade);
            }
        });
    },

    process:function () {
        var me = this;
        this.game.comps.each(function () {
            var comp = this;
            if (Math.random() > 0.5) {
                me.upgradePlanets(comp);
            }
            if (Math.random() > 0.5) {
                if (me.selectForwards(comp)) {
                    var targetsPlanet = me.getTargets(comp);
//               targetsPlanet.each(function(){
//                    comp.sendTo(this);
//                });
                }
            }
        });
    }

});