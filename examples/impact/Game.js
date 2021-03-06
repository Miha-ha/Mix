Mix.define('Game', ['stats', 'Planet', 'Player', 'AI', 'List', 'Map'], {
    static_entityType:{
        planet:1,
        unit:2
    },
    static_context:null,
    init:function (count) {
        this.debug = 1;
        //типы сущностей
        this.planetsTypes = [
            {color:'#FF0000'}
        ];

        this.entities = new List();
        this.comps = new List();
        this.planets = new List();

        this.initGraphics();
        this.genLevel();
        this.initEvents();

        this.ai = new AI(this);
        if (typeof Stats == 'function' && 1 == this.debug) {
            this.stats = new Stats();
            this.stats.domElement.style.position = 'fixed';
            this.stats.domElement.style.left = '0px';
            this.stats.domElement.style.top = '0px';
            document.body.appendChild(this.stats.domElement);
//            setInterval(function () {
//                stats.update();
//            }, 1000 / 60);
        }
    },
    genLevel:function () {
        this.map = new Map(14, 10, this);
        //создаю игроков
        this.human = new Player('HUMAN', this);
        this.comps.add(0, new Player('COMP', this));
        this.comps.add(1, new Player('COMP', this));
        this.comps.add(2, new Player('COMP', this));
        //создаю планеты и распределяю планеты
        this.countPlanets = this.rnd(25, 40);
        for (var i = this.countPlanets; i > -1; --i) {
            var x, y;
            for (var j = 0; j < 20; ++j) {
                x = this.rnd(50, this.canvasWidth - 50);
                y = this.rnd(50, this.canvasHeight - 50);
                //проверка: не пересекается ли планета с другими
                var planets = this.map.selectAround(x, y, 1, Game.entityType.planet);
                var ok = true;
                planets.each(function (index) {
                    var dx = this.pos.x - x,
                        dy = this.pos.y - y,
                        g = Math.sqrt(dx * dx + dy * dy);
                    if (g < 130) {
                        ok = false;
                        return false;
                    }
                });

                if (ok) break;
            }
            var planet = new Planet(x, y, this);
            this.entities.add(planet.id, planet);
            this.planets.add(planet.id, planet);
        }

        //распределяю планеты по игрокам
        this.entities.get(0).setOwner(this.human);
        this.entities.get(0).countUnits = 20;
        this.entities.get(0).setLevel(2);
        this.entities.get(1).setOwner(this.comps.get(0));
        this.entities.get(1).countUnits = 30;
        this.entities.get(1).setLevel(3);
        this.entities.get(2).setOwner(this.comps.get(1));
        this.entities.get(2).countUnits = 30;
        this.entities.get(2).setLevel(3);
        this.entities.get(3).setOwner(this.comps.get(2));
//        this.entities.get(3).maxUnits = 50;
        this.entities.get(3).countUnits = 10;

    },
    initEvents:function () {
        this.canvas.addEventListener("click", this.onMouseClick.bind(this), false);
        this.canvas.addEventListener('dblclick', this.onMouseDbClick.bind(this), false);
        this.canvas.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
    },
    initGraphics:function () {
        this.bgcolor = '#000000';
        this.canvas = document.getElementById('Canvas2D');
        this.ctx = this.canvas.getContext('2d');
        Game.context = this.ctx;//TODO: Заменить все this.ctx на это статическое свойство!
        this.resize();
        this.ctx.globalAlpha = 1;
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        window.addEventListener("resize", this.resize.bind(this), false);
    },
    resize:function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
    },
    render:function () {
        var me = this;
        me.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        me.entities.each(function (index) {
            this.render();
            this.update();
            if (this.isKilled) {
                me.entities.remove(index);
            }
        });

    },
    run:function () {
        var me = this;

        var loop = function () {
            me.render();
            if (1 == me.debug) {
                me.stats.update();
                me.map.render();
            }
            requestAnimFrame(loop);
        };
        loop();
    },
    onMouseClick:function (e) {
        var me = this,
            select = false;

        this.entities.each(function () {
            var cur = this;
            var dist = Math.sqrt((e.x - cur.pos.x) * (e.x - cur.pos.x) + (e.y - cur.pos.y) * (e.y - cur.pos.y));
            if (dist <= cur.r) {
                cur.onMouseClick(e);
                me.human.selectPlanet(cur, true);
                select = true;
                return false;
            }
        });

        if (!select) {
            this.human.unselectPlanets();
        }

        //test
//        console.log(e);
        e.stopPropagation();
        e.preventDefault();
    },
    onMouseDbClick:function (e) {
        var me = this;

        this.entities.each(function () {
            var cur = this;
            var dist = Math.sqrt((e.x - cur.pos.x) * (e.x - cur.pos.x) + (e.y - cur.pos.y) * (e.y - cur.pos.y));
            if (dist <= cur.r) {
                cur.onMouseDbClick(e);
                me.human.sendTo(cur);
                return false;
            }
        });

        e.stopPropagation();
        e.preventDefault();
    },
    onContextMenu:function (e) {
        e.stopPropagation();
        e.preventDefault();
    },
    rnd:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});