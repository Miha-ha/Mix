Mix.config({
    synchronous: true,
    nocache: true,
    path: {
        common: '../../common',
        lib: '../../lib'
    }
}).module({
        name: 'main',
        requires: [
            {
                name: 'lib:backbone',
                requires: ['lib:underscore', 'lib:jquery']
            }
        ],
        body: function (){

            $('body').html('Это работает!');

        }
    });