Mix.define('Game', ['stats', 'Planet', 'Player', 'AI'], {
    entities:[],
    comps:[],
    planets:[],
    init:function (count) {
        this.debug = 1;
        //типы сущностей
        this.planetsTypes = [
            {color:'#FF0000'}
        ];

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
        //создаю игроков
        this.human = new Player('HUMAN', this);
        this.comps.push(new Player('COMP', this));
        this.comps.push(new Player('COMP', this));
        //создаю планеты и распределяю планеты
        this.countPlanets = this.rnd(15, 30);
        for (var i = this.countPlanets; i > -1; --i) {
            var x, y;
            for (var j = 0; j < 10; ++j) {
                x = this.rnd(50, this.canvasWidth - 50);
                y = this.rnd(50, this.canvasHeight - 50);
                //проверка: не пересекается ли планета с другими
                var ok = true;
                for (var p = 0, l = this.entities.length; p < l; ++p) {
                    var dx = this.entities[p].x - x,
                        dy = this.entities[p].y - y,
                        g = Math.sqrt(dx * dx + dy * dy);
                    if (g < 100) {
                        ok = false;
                        break;
                    }

                }
                if (ok) break;
            }
            var planet = new Planet(x, y, this);
            this.entities.push(planet);
            this.planets.push(planet);
        }

        //распределяю планеты по игрокам
        this.entities[0].setOwner(this.human);
        this.entities[0].maxUnits = 50;
        this.entities[0].countUnits = 40;
        this.entities[1].setOwner(this.comps[0]);
        this.entities[1].maxUnits = 50;
        this.entities[1].countUnits = 40;
        this.entities[2].setOwner(this.comps[1]);
        this.entities[2].maxUnits = 50;
        this.entities[2].countUnits = 40;

    },
    initEvents:function () {
        this.canvas.addEventListener("click", this.onMouseClick.bind(this), false);
        this.canvas.addEventListener('dblclick', this.onMouseDbClick.bind(this), false);
    },
    initGraphics:function () {
        this.bgcolor = '#000000';
        this.canvas = document.getElementById('Canvas2D');
        this.ctx = this.canvas.getContext('2d');
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
        var i, l;
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (i = this.entities.length - 1; i > -1; --i) {
            var cur = this.entities[i];
            cur.render();
            cur.update();
            if (cur.isKilled) {
                this.entities.splice(i, 1);
                console.log('Entity c ind=' + i + ' удален!');
            }
        }

        this.fordelete = [];
    },
    run:function () {
        var me = this;

        var loop = function () {
            me.render();
            if (1 == me.debug) {
                me.stats.update();
            }
            requestAnimFrame(loop);
        };
        loop();
    },
    onMouseClick:function (e) {
        var i, l;

        var select = false;
        for (i = 0, l = this.entities.length; i < l; ++i) {
            var cur = this.entities[i];
            var dist = Math.sqrt((e.x - cur.x) * (e.x - cur.x) + (e.y - cur.y) * (e.y - cur.y));
            if (dist <= cur.r) {
                cur.onMouseClick(e);
                this.human.selectPlanet(cur, true);
                select = true;
                break;
            }
        }

        if (!select) {
//            for (i = this.human.selected.length - 1; i > -1; i--) {
//                this.human.selectPlanet(this.human.selected[i], false);
//            }
            this.human.unselectPlanets();
        }

    },
    onMouseDbClick:function (e) {
        var i, l;

        for (i = 0, l = this.entities.length; i < l; ++i) {
            var cur = this.entities[i];
            var dist = Math.sqrt((e.x - cur.x) * (e.x - cur.x) + (e.y - cur.y) * (e.y - cur.y));
            if (dist <= cur.r) {
                this.human.sendTo(cur);
                break;
            }
        }

    },
    rnd:function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});