Mix.config({
    synchronous: true,
    nocache: false,
    path: {
        common: '../../common/'
    }
}).module({
        name: 'main',
        requires: ['common:EventManager', 'Ping', 'Pong'],
        body: function (){
            var eventManager = new EventManager(),
                ping = new Ping(eventManager),
                pong = new Pong(eventManager);

            ping.send();
        }

    });