Mix.define('List', {
    init: function (){
        this.length = 0;
        this.items = {};
    },
    add: function (index, item){
        this.items[index] = item;
        this.length++;
    },
    remove: function (index){
        delete this.items[index];
        this.length--;
    },
    clear: function (){
        for (var i in this.items) {
            delete this.items[i];
        }
        this.length = 0;
    },
    get: function (index){
        if (index in this.items) {
            return this.items[index];
        }
        return null;
    },
    each: function (f){
        for (var i in this.items) {
            if (false === f.call(this.items[i], i))
                break;
        }
    }
});