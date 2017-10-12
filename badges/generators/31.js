generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);


    ctx.save();
    ctx.shadowColor = "#000";
    // ctx.translate(s/2,s/2);

    var points= [];
    var tot = 20;
    var ang = -PI / 2;
    var step = PI * 2 / tot;
    var r = s * Math.sqrt( 2 ) * .5;

    ctx.save();
    ctx.translate(s/2,s/2);
    var golden_angle = Math.PI * 2 / ( ( 1 + Math.sqrt(5) ) / 2 );var count  = 100;
    for( var i = 0; i < count; i++ ) {
        var theta = i * golden_angle;
        var radius = Math.sqrt( i / count ) * s / 3;
        var p = new Point( Math.cos(theta) * radius,Math.sin(theta) * radius, 1 + i/count );
        points.push( p );
        g.disc( p, p.z * 2 * unit );
        // g.circle(Math.cos(theta) * radius,Math.sin(theta) * radius, 1 );
    }

    var voronoi = new Voronoi();
    var bbox = {xl: -s, xr: s, yt: -s, yb: s};

    var diagram = voronoi.compute(points, bbox);
    diagram.edges.forEach(function(e){
        ctx.globalAlpha = .25;
        ctx.beginPath();
        ctx.moveTo(e.va.x, e.va.y);
        ctx.lineTo(e.vb.x, e.vb.y);
        ctx.stroke();
    });

    ctx.restore();

};