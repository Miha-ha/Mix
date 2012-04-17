Mix.define('AI', {
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
    getTarget:function (player) {
        var target = null,
            countForwards = player.countForwards();
        this.game.planets.each(function () {
            var planet = this;
            //если расстояние от любой планеты нападающих позволяет напасть
            var distanceOk = false;

            player.selected.each(function () {
                var d = this.pos.getDistance(planet.pos, false);
                if (d < 400) {
                    distanceOk = true;
                    return false;
                }
            });

            if (!distanceOk) return true;

            if (planet.owner != player)
                target = planet;
        });

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

        this.game.planets.each(function (index) {
            var planet = this,
                u = Math.floor(planet.maxUnits / 3);

            if (planet.owner == player && planet.countUnits >= u) {
                player.selectPlanet(planet, true);
                ok = true;
            }
        });
        return ok;
    },
    process:function () {
        var me = this;
        this.game.comps.each(function () {
            var comp = this;
            if (Math.random() > 0.9) return true;//смелость при атаке
            if (me.selectForwards(comp)) {
                var targetPlanet = me.getTarget(comp);
                if (targetPlanet) {
                    comp.sendTo(targetPlanet);
                }
            }
        });
    }

});