Mix.config({
    synchronous: true,
    nocache: true,
    path: {
        libs: '../../libs',
        common: '../../common'
    }
}).module({
        name: 'main',
        requires: ['common:List', 'libs:jquery'],
        body: function (){

            $('body').html('It works!!!');
            var list = new List();
            console.log(list.length);

        }

    });