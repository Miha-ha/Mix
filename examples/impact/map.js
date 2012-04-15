Mix.define('Map', ['List'], {
    init:function (cw, ch, game) {
        this.game = game;
        this.sw = Math.floor(game.canvasWidth / cw);   //ширина ячейки
        this.sh = Math.floor(game.canvasHeight / ch);   //высота ячейки
        this.cw = cw;                               //кол-во ячеек по ширине
        this.ch = ch;                               //кол-во ячеек по высоте
        this.map = new List();                              //карта ячеек
        for (var i = 0; i < cw * ch; ++i) {
            this.map.add(i, new List());
        }
    },
    render:function () {
        var ctx = this.game.ctx;
        ctx.strokeStyle = "gray";
        //подсветить мышку
        /*
         var mx = (ig.input.mouse.x/sw).floor();
         var my = (ig.input.mouse.y/sh).floor();
         ctx.fillStyle = "white";
         ctx.fillRect(mx*sw, my*sh, sw, sh);
         */
        ctx.beginPath();

        for (var c = 1; c < this.cw; ++c) {
            var curPos = c * this.sw;
            ctx.moveTo(curPos, 0);
            ctx.lineTo(curPos, this.game.canvasHeight);
        }

        for (var r = 1; r < this.ch; ++r) {
            curPos = r * this.sh;
            ctx.moveTo(0, curPos);
            ctx.lineTo(this.game.canvasWidth, curPos);
        }

        ctx.strokeStyle = "gray";
        ctx.stroke();
        ctx.closePath();

        for (var i = 0; i < this.ch; ++i)
            for (var j = 0; j < this.cw; ++j) {
                var index = j + this.cw * i;
//                ctx.strokeStyle = 'gray';
                ctx.fillStyle = 'gray';
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.map.get(index).length, j * this.sw + 5, i * this.sh + 5);
            }
//        this.map.each(function(index){
//
//        });
    },
    entityMoved:function (entity, removed) {
        if (entity.last.equals(entity.pos)) return;


        var cellXold = Math.floor(entity.last.x / this.sw);
        var cellYold = Math.floor(entity.last.y / this.sh);
        var indexold = cellXold + this.cw * cellYold;

        var cellX = Math.floor(entity.pos.x / this.sw);
        var cellY = Math.floor(entity.pos.y / this.sh);
        var index = cellX + this.cw * cellY;
        if (index >= 0 && index < this.map.length && indexold >= 0 && indexold < this.map.length) {
            var cell = this.map.get(index);
            var cellOld = this.map.get(indexold);

            if (index != indexold) {
                //                        cellOld.count--;
                if (cellOld.get(entity.id))
                    cellOld.remove(entity.id);
            } else {
                //                        cell.count++;
                if (!cell.get(entity.id) && !removed)
                    cell.add(entity.id, entity);

            }

            if (removed) {
                //удаление
                if (cellOld.get(entity.id))
                    cellOld.remove(entity.id);
                if (cell.get(entity.id))
                    cell.remove(entity.id);
            }
        }
    }

});