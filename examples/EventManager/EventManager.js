Mix.define('EventManager', {
    subscribers:{},
    addSubscriber:function (subscriber, events) {
        for (var i in events) {
            if (!this.subscribers[events[i]]) {
                this.subscribers[events[i]] = [];
            }
            this.subscribers[events[i]].push(subscriber);
        }
    },
    removeSubscriber:function (subscriber) {
        for (var i in this.subscribers) {
            for (var j in this.subscribers[i]) {
                if (this.subscribers[i][j] === subscriber) {
                    this.subscribers[i].splice(j, 1);
                }
            }
        }
    },
    removeAllSubscribers:function () {
        this.subscribers = {};
    },
    fireEvent:function (event) {
        var subscribers = this.subscribers[event.name];
        for (var i in subscribers) {
            subscribers[i].notify(event);
        }
    }
});