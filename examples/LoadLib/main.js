Mix.config({
    synchronous: true,
    nocache: true,
    path: {
        lib: '../../lib',
        common: '../../common'
    }
}).module({
        name: 'main',
        requires: ['common:List', 'lib:jquery'],
        body: function (){

            $('body').html('It works!!!');
            var list = new List();
            for(var i=0; i<10; ++i)
                list.add(i,i);
            console.log(list.length);

        }

    });