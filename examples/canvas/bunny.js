Mod.module({
    name:'bunny',
    requires:[],
    body:function () {

        function Bunny() {
            this.speedX = 0;
            this.speedY = 0;
            this.x = 0;
            this.y = 0;
        }

        var snapping = true,
            bcolor = "rgba(200, 200, 255, 1)";

        window.setupBunny = function (width, height) {
            var numBunnies = 10000,
                gravity = 3,
                bunnies = [],
                maxX = width,
                minX = 0,
                maxY = height,
                minY = 0,
                img = new Image();

            img.src = 'wabbit_alpha.png';

            var bunny;

            for (var i = 0; i < numBunnies; i++) {
                bunny = new Bunny();
                bunny.speedX = Math.random() * 10;
                bunny.speedY = (Math.random() * 10) - 5;

                bunnies.push(bunny);
            }


            var canvas = document.getElementById('Canvas2D');
            var c = canvas.getContext('2d');


            function render() {
                var bunny;

                c.fillStyle = bcolor;
                c.fillRect(0, 0, maxX, maxY);

                for (i = 0; i < numBunnies; i++) {
                    bunny = bunnies[i];

                    bunny.x += bunny.speedX;
                    bunny.y += bunny.speedY;
                    bunny.speedY += gravity;

                    if (bunny.x > maxX) {
                        bunny.speedX *= -1;
                        bunny.x = maxX;
                    }
                    else if (bunny.x < minX) {
                        bunny.speedX *= -1;
                        bunny.x = minX;
                    }

                    if (bunny.y > maxY) {
                        bunny.speedY *= -0.8;
                        bunny.y = maxY;

                        if (Math.random() > 0.5) {
                            bunny.speedY -= Math.random() * 12;
                        }
                    }
                    else if (bunny.y < minY) {
                        bunny.speedY = 0;
                        bunny.y = minY;
                    }

                    if (snapping)
                        c.drawImage(img, (0.5 + bunny.x) | 0, (0.5 + bunny.y) | 0);
                    else
                        c.drawImage(img, bunny.x, bunny.y);
                }

                requestAnimFrame(render);
            }

            // var loop = setInterval(function(){render();}, 1000/30);
            render();


        }

    }
});