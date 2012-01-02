Mix.module({
    name:'classtest',
    requires:['SimpleClass'],
    body:function () {
        console.log('class test');

        var c = new SimpleClass();
        c.log();
    }
});