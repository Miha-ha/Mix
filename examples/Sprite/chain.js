Mix.define('Chain', {
    nodes: [],
    curNodeIndex: 0,
    active: true,
    loop: false,
    init: function (loop){
        this.nodes = [];
        this.loop = !!loop;
    },
    setActive: function (active){
        this.active = active;
    },
    nextNode: function (){
        if (this.loop) {
            this.curNodeIndex = (this.curNodeIndex + 1) % this.nodes.length;
//            if(this.curNodeIndex === 0) this.start = new Date().getTime();
//            console.log('curNodeIndex: '+ this.curNodeIndex);
        } else {
            this.nodes.shift();
        }
    },
    update: function (){
        if (!this.active) return;

        while (this.nodes.length > 0) {
            var curNode = this.nodes[this.curNodeIndex];
            if (curNode.update) {
                curNode.update();
                break;
            } else {
                curNode.execute();
                this.nextNode();
            }
        }

    },
    delay: function (msec){
        var me = this;
        this.nodes.push({
            update: function (){
                this.start = this.start || new Date().getTime();
                var curTime = new Date().getTime();
                if (curTime - this.start >= msec) {
                    this.start = undefined;
                    me.nextNode();
                }
            }
        });
        return this;
    },
    execute: function (func){
        this.nodes.push({
            execute: func
        });

        return this;
    }

});