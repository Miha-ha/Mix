Mod.module({
    name:'ctests',
    requires:['c1'],
    body:function () {
        console.log('ctests');

        var c = new c1();
        c.log();
    }
});