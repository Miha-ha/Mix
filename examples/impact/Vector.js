Mix.define('Vector', {
    init:function () {
        var countArgs = arguments.length;
        this.x = 0.0;
        this.y = 0.0;

        if (countArgs === 2) {
            this.x = arguments[0];
            this.y = arguments[1];
        } else if (countArgs === 1) {
            this.x = arguments[0].x;
            this.y = arguments[0].y;
        }
    },

    set:function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    },

    clone:function () {
        return new Vector(this.x, this.y);
    },

    getDistance:function (vec, squared) {
        var x = vec.x - this.x,
            y = vec.y - this.y,
            g = x * x + y * y;
        return squared ? g : Math.sqrt(g);
    },

    isNaN:function () {
        return isNaN(this.x) || isNaN(this.y);
    },

    isZero:function () {
        return this.x == 0 && this.y == 0;
    },

    getLength:function (squared) {
        var l = this.x * this.x + this.y * this.y;
        return squared ? l : Math.sqrt(l);
    },

    neg:function () {
        return new Vector(-this.x, -this.y);
    },

    add:function (vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    },

    sub:function (vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    },

    mul:function (vector) {
        return new Vector(this.x * vector.x, this.y * vector.y);
    },

    div:function (vector) {
        return new Vector(this.x / vector.x, this.y / vector.y);
    },

    mod:function (vector) {
        return new Vector(this.x % vector.x, this.y % vector.y);
    },

    dot:function (vector) {
        return this.x * vector.x + this.y * vector.y;
    },

    cross:function (vector) {
        return this.x * vector.y - this.y * vector.x;
    },

    project:function (vector) {
        if (vector.isZero()) {
            return new Vector(0, 0);
        } else {
            var scale = this.dot(vector) / vector.dot(vector);
            return new Vector(
                vector.x * scale,
                vector.y * scale
            );
        }
    },

    getDirectedAngle:function (vector) {
        return Math.atan2(this.cross(vector), this.dot(vector)) * 180 / Math.PI;
    },

    toString:function () {
        return '{ x: ' + this.x + ', y: ' + this.y + ' }';
    }
});