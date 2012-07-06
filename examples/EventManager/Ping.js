Mix.define('Ping', {
    static_EVENT:{
        PING:'Ping.EVENT.PING'
    },
    count:0,
    e:{name:'Ping.EVENT.PING'},
    init:function (eventManager) {
        this.eventManager = eventManager;
        this.eventManager.addSubscriber(this, ['Pong.EVENT.PONG']);
    },
    notify:function (event) {
        console.log('Ping received: ' + event.name);
        if (this.count < 10)
            this.send();
    },
    send:function () {
        this.count++;
        console.log(this.count + '. Ping send: ' + this.e.name);
        this.eventManager.fireEvent(this.e);
    }

});