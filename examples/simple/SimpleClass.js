Mix.define('SimpleClass', {
    extend:'SimpleClassParent',
    init:function () {
        this._super();
        console.log('SimmpleClass init!');
    },
    log:function () {
        this._super();
        console.log('SimpleClass log');
    }
});