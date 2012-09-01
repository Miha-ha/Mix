Mix.config({
    synchronous: true,
    nocache: false,
    path: {
        common: '../../common'
    }
}).module({
        name: 'main',
        requires: ['Circles', 'common:stats'],
        body: function (){

            var circles = new Circles(100);
            circles.run();

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