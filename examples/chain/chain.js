Mix.define('Chain', {
    nodes:[],
    active:true,
    setActive:function (active) {
        this.active = active;
    },
    update:function () {
        if (!this.active) return;

        while (this.nodes.length > 0) {
            var curNode = this.nodes[0];
            if (curNode.update) {
                curNode.update();
                break;
            } else {
                curNode.execute();
                this.nodes.shift();
            }
        }

    },
    delay:function (msec) {
        var me = this;
        this.nodes.push({
            update:function () {
                this.start = this.start || new Date().getTime();
                var curTime = new Date().getTime();
                if (curTime - this.start >= msec) me.nodes.shift();
            }
        });
        return this;
    },
    execute:function (func) {
        this.nodes.push({
            execute:func
        });

        return this;
    }

});