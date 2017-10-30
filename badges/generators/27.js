generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    //tris are arrays storing the top left and bottom right corners
    //of a rect, no need for an actual class
    var Tri = {

        build: function ( a,b,c) {
            return [a,b,c];
        },

        split: function (tri, r0, r1 ) {

            var p0 = tri[0].pointAt(r0, tri[1]);
            var p1 = tri[0].pointAt(r0, tri[2]);
            var p = p0.pointAt( r1, p1 );

            return [

                Tri.build( tri[0], p, tri[1] ),
                Tri.build( tri[1], p, tri[2] ),
                Tri.build( tri[2], p, tri[0] )

            ];
        },

        draw: function (ctx, tri) {
            ctx.beginPath();
            ctx.moveTo(tri[0].x, tri[0].y);
            ctx.lineTo(tri[1].x, tri[1].y);
            ctx.lineTo(tri[2].x, tri[2].y);
            ctx.fill();
        }

    };
    PRNG.setSeed(seed || 0);

    var ang = -PI / 2;
    var step = PI / 3 * 2;
    var r = s * Math.sqrt(2) * 2;

    var a = new Point( Math.cos( ang ) * r, Math.sin( ang ) * r );
    ang+=step;
    var b = new Point( Math.cos( ang ) * r, Math.sin( ang ) * r );
    ang+=step;
    var c = new Point( Math.cos( ang ) * r, Math.sin( ang ) * r );

    tris = [Tri.build(a,b,c)];
    ctx.save();
    ctx.translate(s/2,s/2+ 0.5 * r);
    g.polyline([a,b,c], true);
    while( tris.length < 10000 ){

        //gets a random quad
        var id = parseInt( ( 1-Math.sqrt( PRNG.random() ) ) * tris.length );

        var t = tris[id];
        t = tris.splice(id, 1)[0];

        //subdivide it
        var tmp = Tri.split( t, PRNG.random(), PRNG.random() );
        tris = tris.concat(tmp);

    }
    ctx.save();
    tris.forEach(function (q, i) {
        var v = 0xFF - ( i % 0xFF );
        ctx.strokeStyle = "#000";
    ctx.globalAlpha = .5;
        ctx.lineWidth = 14 * unit;
        Tri.draw(ctx, q);
        ctx.stroke();
        ctx.strokeStyle = ctx.fillStyle = "rgba(" + v + "," + v + "," + v + ",1)";
        ctx.lineWidth = 10 * unit;
        Tri.draw(ctx, q);
        ctx.stroke();
    });

    ctx.restore();
    ctx.restore();

    return LANDSCAPE;

};
