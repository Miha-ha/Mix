Mix.config({
    synchronous: true,
    nocache: false
}).module({
        name: 'main',
        requires: ['Mathematics.Geometry.Point'],
        body: function (){
            var p = new Mathematics.Geometry.Point(10, 10);
            alert(p);
        }
    });