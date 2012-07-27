Mix.define('MImage', {
    data: null,
    width: 0,
    height: 0,
    loaded: false,
    failed: false,
    path: '',
    init: function (path){
        this.path = path;
        this.data = new Image();
        this.data.onload = this.onLoad.bind(this);
        this.data.onerror = this.onError.bind(this);
        this.data.src = this.path;// + Mix.nocache;
    },
    onLoad: function (event){
        this.width = this.data.width;
        this.height = this.data.height;
        this.loaded = true;
    },
    onError: function (event){
        this.failed = true;
    },
    draw: function (ctx, targetX, targetY, sourceX, sourceY, width, height){
        if (!this.loaded) {
            return;
        }

        sourceX = sourceX || 0;
        sourceY = sourceY || 0;
        width = width || this.width;
        height = height || this.height;

        ctx.drawImage(this.data, sourceX, sourceY, width, height, targetX, targetY, width, height);
    },
    drawTile: function (ctx, targetX, targetY, tile, tileWidth, tileHeight, flipX, flipY){
        tileHeight = tileHeight ? tileHeight : tileWidth;

        if (!this.loaded || tileWidth > this.width || tileHeight > this.height) {
            return;
        }

        var scaleX = flipX ? -1 : 1;
        var scaleY = flipY ? -1 : 1;

        if (flipX || flipY) {
            ctx.save();
            ctx.scale(scaleX, scaleY);
        }

        ctx.drawImage(
            this.data,
            ( Math.floor(tile * tileWidth) % this.width ),
            ( Math.floor(tile * tileWidth / this.width) * tileHeight ),
            tileWidth,
            tileHeight,
            targetX * scaleX - (flipX ? tileWidth : 0),
            targetY * scaleY - (flipY ? tileHeight : 0),
            tileWidth,
            tileHeight
        );
        if (flipX || flipY) {
            ctx.restore();
        }
    }
});