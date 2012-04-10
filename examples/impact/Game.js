Mix.define('Game', ['Planet', 'Player'], {
    entities:[],
    players:[],
    fordelete:[],
    init:function (count) {
        //типы сущностей
        this.planetsTypes = [
            {color:'#FF0000'}
        ];

        //инициализирую игроков
        this.human = new Player('HUMAN', this);
        //создаю планеты
        var p1 = new Planet(100, 100, this);
        p1.setOwner(this.human);

        this.entities.push(p1);
        this.entities.push(new Planet(300, 200, this));
        this.entities.push(new Planet(600, 400, this));
        this.entities.push(new Planet(500, 600, this));
        this.entities.push(new Planet(700, 500, this));
        this.entities.push(new Planet(1000, 200, this));

        this.initGraphics();
        this.initEvents();
    },
    initEvents:function () {
        this.canvas.addEventListener("click", this.onMouseClick.bind(this), false);
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
        for (i = 0, l = this.entities.length; i < l; ++i) {
            this.entities[i].update();
            this.entities[i].render();
        }

        for (i = 0, l = this.fordelete.length; i < l; ++i) {
            this.entities.splice(this.fordelete[i], 1);
        }
        this.fordelete = [];
    },
    run:function () {
        var me = this;

        var loop = function () {
            me.render();
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
                this.human.selectPlanet(cur, true);
                select = true;
            }
        }

        if (!select) {
            for (i = 0, l = this.human.selected.length; i < l; ++i) {
                this.human.selected[i].select(false);
            }
        }

    },
    rnd:function (min, max) {
        return ((Math.random() * (max - min + 1) + 0.5) | 0) + min;
    }
});