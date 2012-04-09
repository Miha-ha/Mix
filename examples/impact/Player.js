Mix.define('Player', {
    selected: [],
    init:function (type) {
        this.type = type; //HUMAN or COMP
    },
    selectPlanet: function(planet){
        if(planet.isSelect) return;

        planet.select(true);
        this.selected.push(planet);
    }

});