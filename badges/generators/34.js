generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    var turns = 10;
    var total = Math.PI * 2  * turns;
    var minRadius = s/5;
    var maxRadius = minRadius + s/5;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;

    var i = 0;
    var points = [];
    ctx.save();
    ctx.translate( s/2,s/2 );
    for ( var angle = 0; angle <= total; angle+=ga ){

        var radius = map( angle, 0, total, minRadius, maxRadius );
        var x = Math.cos( angle ) * radius;
        var y = Math.sin( angle ) * radius * .62;

        var ang = ( PRNG.random() * Math.PI * 2 );

        x = Math.cos( ang ) * radius;
        y = Math.sin( ang ) * radius;

        points.push( [x, y] );

    }
    ctx.fillStyle = "#000";

    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2 * unit;
    ctx.lineJoin = "round";


    var convex = hull(points, 80 * unit );
    g.polygon(convex, true);

    var delaunay = new Delaunator( convex );
    var tris = delaunay.triangles;
    for( i = 0; i < tris.length; ){
        drawTri( ctx, convex, tris[i++], tris[i++], tris[i++]);
    }

    convex = hull(points, 150 * unit  );
    ctx.strokeStyle = "#000";
    g.polyline(convex, true);

    function drawTri( ctx, ps, a, b, c ){

        ctx.beginPath();
        ctx.moveTo(ps[a][0], ps[a][1]);
        ctx.lineTo(ps[b][0], ps[b][1]);
        ctx.lineTo(ps[c][0], ps[c][1]);
        ctx.lineTo(ps[a][0], ps[a][1]);
        ctx.stroke()

    }

    ctx.restore();
    return PORTRAIT;

};