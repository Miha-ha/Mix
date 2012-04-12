Mix.define('AI', {
    init:function (game) {
        this.game = game;
        this.process();
        setInterval(this.process.bind(this), 5000);
    },
    /**
     * Примерный алгорит выбора цели:
     * каждой планете назначить коэффициент из следующих параметров
     * 0. доступное расстояние!!!
     * 1. countUnits
     * 2. maxUnits
     * 3. productivity
     * 4. среднее расстояние от планет игрока до планеты нападения
     * и выбрать планету с лучшим коэфф.
     * @param player
     */
    getTarget:function (player) {
        var target = null,
            countForwards = player.countForwards();
        for (var i = 0, l = this.game.planets.length; i < l; ++i) {
            var planet = this.game.planets[i];


            //если расстояние от любой планеты нападающих позволяет напасть
            var distanceOk = false;
            for (var k = 0, l2 = player.selected.length; k < l2; ++k) {
                var d = player.selected[k].getDistance(planet, false);
                //console.log('Дистанция: '+Math.floor(d)+', юнитов: '+planet.countUnits);
                if (d < 300) {
                    distanceOk = true;
                    break;
                }
            }

            if (!distanceOk) continue;

            if (planet.owner != player)
                target = planet;

            if (target && planet.countUnits > target.countUnits)
                target = null;
        }

        if (target && target.countUnits <= countForwards)
            return target;

        return null;
    },
    /**
     *  Выбрать все планеты у которых больше половины от максимально возможного кол-ва юнитов
     * @param player
     */
    selectForwards:function (player) {
        var ok = false;
        player.unselectPlanets();
        for (var i = 0, l = this.game.planets.length; i < l; ++i) {
            var planet = this.game.planets[i],
                u = Math.floor(planet.maxUnits / 3);

            if (planet.owner == player && planet.countUnits >= u) {
                player.selectPlanet(planet, true);
                ok = true;
            }
        }
        return ok;
    },
    process:function () {
        for (var i = 0, l = this.game.comps.length; i < l; ++i) {
            var comp = this.game.comps[i];
            if (this.selectForwards(comp)) {
                var targetPlanet = this.getTarget(comp);
                if (targetPlanet) {
                    comp.sendTo(targetPlanet);
                }
            }

        }
    }

});