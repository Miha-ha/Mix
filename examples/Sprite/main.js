Mix.config({
    synchronous: true,
    path: {
        common: '../../common'
    },
    nocache: false
}).module({
        name: 'main',
        requires: ['Game', 'common:stats'],
        body: function (){

            var game = new Game();
            game.run();

            if (typeof Stats == 'function') {
                //clearInterval(interval);
                var stats = new Stats();
                stats.domElement.style.position = 'fixed';
                stats.domElement.style.left = '0px';
                stats.domElement.style.top = '0px';
                document.body.appendChild(stats.domElement);
                setInterval(function (){
                    stats.update();
                }, 1000 / 60);

            }

        }

    });