Mix.module({
    name:'m2',
    requires:['m3', 'm4', 'classtest'],
    body:function () {
        console.log('m2');
    }
});