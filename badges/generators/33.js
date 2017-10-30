generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);



    var turns = 10;
    var total = Math.PI * 2  * turns;
    var minRadius = s/5;
    var maxRadius = minRadius + s/5;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;

    var i=0;
    ctx.save();
    ctx.translate( s/2,s/2 );
    var points = [];
    var sca = .001 / unit;
    for ( var angle = 0; angle <= total; angle+=ga ){

        var radius = map( angle, 0, total, minRadius, maxRadius );
        var x = Math.cos( angle ) * radius;
        var y = Math.sin( angle ) * radius * .62;

        var ang = ( PRNG.FBM_legacy( x * sca, y * sca, 2 ) * Math.PI * 4 );

        x += Math.cos( ang ) * radius * .25;
        y += Math.sin( ang ) * radius * .25;

        points.push( [x, y] );

    }
    ctx.fillStyle = "#000";

    var convex = hull( points, 20 * unit );
    g.polygon(convex, true);


    ctx.globalAlpha = .5;
    convex = hull(points, 50 * unit );
    ctx.lineWidth = 2 * unit;
    g.polyline(convex, true);

    convex = hull(points, 70 * unit);
    ctx.lineWidth = unit;
    g.polyline(convex, true);

    ctx.globalAlpha = 1;
    points.forEach(function (p){

        var x = p[0];
        var y = p[1];

        ctx.fillStyle = "#000";
        g.disc( x,y, 4 * unit );
        ctx.fillStyle = "#FFF";
        g.disc( x,y, 2 * unit );

    });

    ctx.restore();
    return PORTRAIT;


};