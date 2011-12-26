Mod.define('c1', {
    extend: 'c1Parent',
    init: function(){
        this._super();
        console.log('c1 init!');
    },
    log: function(){
        this._super();
        console.log('c1 log');
    }
});