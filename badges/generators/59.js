generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );
    ctx.scale( Math.sqrt( 2 ) * .5,  .5 );
    ctx.rotate( Math.PI / 4 * 2 );
    ctx.translate(-s/2, -s/2 );

    var step = s / 100;
    // ctx.globalAlpha = .1;

    var sca = 0.5 / s;
    var oct = 3;
    var amp = ( s / 2 );

    var or = new Point( s/2,s/2 );
    var p = new Point( 0,0 );

    ctx.globalAlpha = 0.5;
    for( i = -s; i <= s*2; i += step ){



        for( j = -s; j <= s*2; j += step ){

            p.set( i, j );

            var n = ( PRNG.FBM( i * sca, j * sca, oct ) - PRNG.FBM( ( s - j ) * sca, i * sca, oct * 2 ) ) * .25;

            if( n <= 0 )continue;

            offset = ( n ) * amp;
            ctx.beginPath();
            ctx.arc( i, j, Math.abs( offset ), PI/4*3, -PI/4*3, false );
            ctx.stroke();


        }
    }
    ctx.restore();

};
