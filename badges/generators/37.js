generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    var turns = 10;
    var total = Math.PI * 2  * turns;
    var minRadius = s/8;
    var maxRadius = minRadius + s/6;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;

    var i = 0;
    var points = [];
    ctx.save();
    ctx.translate( s/2,s/2 );
    for ( var angle = 0; angle <= total; angle+=ga ){

        var radius = map( angle, 0, total, minRadius, maxRadius );
        var x = Math.cos( angle ) * radius;
        var y = Math.sin( angle ) * radius * .62;

        var ang = ( PRNG.random() * Math.PI * 4 );
        x += Math.cos( ang ) * radius;
        y += Math.sin( ang ) * radius * .62;
        points.push( [x, y] );

    }

    ctx.strokeStyle = "#000";
    ctx.lineWidth = unit;
    ctx.lineJoin = "round";

    var it = 5;
    for( i = 10; i < 150; i += it ){

        ctx.globalAlpha = .1;
        var convex = hull(points, i );
        g.polygon(convex, true);
        g.polyline(convex, true);
        it *= 2;

    }
    ctx.globalAlpha = 1;
    ctx.stroke()

    ctx.restore();

};