generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    //quads are arrays storing the top left and bottom right corners
    //of a rect, no need for an actual class
    var Quad = {

        build: function (x, y, l, b) {
            return [x, y, l, b];
        },

        split: function (quad, nx, ny) {

            var ox = quad[0];
            var oy = quad[1];

            var right = quad[2];
            var bottom = quad[3];

            return [

                //top left
                Quad.build(ox, oy, nx, ny),

                //top right
                Quad.build(nx, oy, right, ny),

                // bottom right
                Quad.build(nx, ny, right, bottom),

                //bottom left
                Quad.build(ox, ny, nx, bottom)

            ];
        },

        contains: function (quad, x, y) {
            return quad[0] < x && x < quad[2] && quad[1] < y && y < quad[3];
        },

        draw: function (ctx, quad) {
            ctx.beginPath();
            ctx.moveTo(quad[0], quad[1]);
            ctx.lineTo(quad[2], quad[1]);
            ctx.lineTo(quad[2], quad[3]);
            ctx.lineTo(quad[0], quad[3]);
            ctx.lineTo(quad[0], quad[1]);
            ctx.fill();
        }

    };
    PRNG.setSeed(seed || 0);


    quads = [Quad.build(0, 0, s, s)];
    ctx.save();

    while( quads.length < 1000 ){

        //gets a random quad
        var id = parseInt( ( 1-Math.sqrt( PRNG.random() ) ) * quads.length );

        var q = quads[id];

        //finds it's center
        var x = q[0] + ( q[2] - q[0] ) / 2;
        var y = q[1] + ( q[3] - q[1] ) / 2;

        //then remove this quad from our list
        q = quads.splice(id, 1)[0];

        //subdivide it
        var tmp = Quad.split(q, x, y);

        //and merge the 4 new quads to the list
        quads = quads.concat(tmp);

    }

    ctx.globalAlpha = 1;
    quads.forEach(function (q, i) {
        var v = 0xFF - ( i % 0xFF );
        ctx.strokeStyle = "rgba(" + v + "," + v + "," + v + ",1)";
        ctx.fillStyle = "rgba(" + v + "," + v + "," + v + ",1)";
        Quad.draw(ctx, q);
        ctx.stroke();
    });

    ctx.restore();

    return LANDSCAPE;


};
