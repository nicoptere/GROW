generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );
    ctx.scale( Math.sqrt( 2 ) * .5,  .35 );
    ctx.rotate( Math.PI / 3 );
    ctx.translate(-s/2, -s/2 );

    var step = s / 20;
    var sca = 0.5 / s;
    var oct = 2;
    var amp = ( s / 2 );

    var or = new Point( s/2,s/2 );
    var p = new Point( 0,0 );
    var points = [];

    for( i = -s; i <= s*2; i += step ){

        for( j = -s; j <= s*2; j += step ){

            var n = ( PRNG.FBM( i * sca, j * sca, oct )* PRNG.FBM( ( s - j ) * sca, i * sca, oct  ) ) * s;

            points.push( p.set( i - n, j - n, n ).clone() );

        }
    }


    function pointLineDistance( p, a,b ){
        var pp = geomUtils.project(p, a,b );
        return getDistance( p, pp ) / s;
    }


    var min = 120*unit;
    var a0 = new Point( 0, 0 );
    var a1 = new Point( s, s );

    points.forEach( function (p, i){

        points.forEach( function (o, j ){
            if( i === j )return;
            var d = getDistance(p, o);
            if( d > min )return;

            var t = Math.pow( 1 - pointLineDistance(p, a0,a1 ), 3 );
            ctx.globalAlpha = t * .5;//poit1 - d/min;
            ctx.lineWidth = ( 1 - t ) * unit * 10;

            g.line( p, o );

        });

    });

    ctx.restore();
    return LANDSCAPE;

};
