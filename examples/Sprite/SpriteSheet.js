Mix.define('SpriteSheet', ['MImage'], {
    width: 8,
    height: 8,
    image: null,

    init: function (path, width, height){
        this.width = width;
        this.height = height;

        this.image = new MImage(path);
    }
});