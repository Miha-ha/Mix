Mix.config({
    synchronous: true,
    nocache: false,
    path: {
        common: '../../common'
    }
}).module({
        name: 'main',
        requires: ['common:Chain'],
        body: function (){

            var start,
                chain = new Chain()
                    .execute(function (){
                        console.log('Жду 1 секунду...');
                        start = new Date().getTime();
                    })
                    .delay(1000)
                    .execute(function (){
                        console.log('Прошло: ' + (new Date().getTime() - start) / 1000 + 'с. Жду 3 секунды...');
                        start = new Date().getTime();
                    })
                    .delay(3000)
                    .execute(function (){
                        console.log('Прошло: ' + (new Date().getTime() - start) / 1000 + 'с.');
                    });

            setInterval(chain.update.bind(chain), 1000 / 30);
        }

    });