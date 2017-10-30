generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();

    function pointLineDistance( p, a,b ){
        var pp = geomUtils.project(p, a,b, true );
        return getDistance( p, pp );
    }

    var points = Poisson.distribute( 10000, unit * 7, s,s )

    var lines = [];
    for( var i = 0; i < 50; i++ ){
        var p0 = new Point(PRNG.random() * s, PRNG.random() * s );
        var p1 = new Point(PRNG.random() * s, PRNG.random() * s );
        lines.push( [p0, p1]);
    }

    points.forEach(function(p){
        var d;
        var min = Number.POSITIVE_INFINITY;
        lines.forEach(function( l ){
            min = Math.min( min, pointLineDistance( p, l[0], l[1] ) );
        });
        var w = Math.min( 10 * unit , unit  * ( min / s ) * 1000 );
        g.disc( p, w );

    });

    ctx.restore();
    return PORTRAIT;

};
