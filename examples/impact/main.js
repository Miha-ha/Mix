Mix.config({
    synchronous: true,
    nocache: false,
    path: {
        common: '../../common'
    }
}).module({
        name: 'main',
        requires: ['Game', 'Vector', 'common:List', 'common:stats'],
        body: function (){
            var game = new Game();
            game.run();
        }

    });