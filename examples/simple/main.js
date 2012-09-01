Mix.config({
    synchronous: true,
    nocache: true
}).module({
        name: 'main',
        requires: ['m2', 'm3', 'utils.m5'],
        body: function (){
            console.log('main');
        }
    });