Mix.define('Pong', {
    static_EVENT:{
        PONG:'Pong.EVENT.PONG'
    },
    e:{name:'Pong.EVENT.PONG'},
    init:function (eventManager) {
        this.eventManager = eventManager;
        this.eventManager.addSubscriber(this, ['Ping.EVENT.PING']);
    },
    notify:function (event) {
        console.log('Pong received: ' + event.name);
        this.send();
    },
    send:function () {
        console.log('Pong send: ' + this.e.name);
        this.eventManager.fireEvent(this.e);
    }

});