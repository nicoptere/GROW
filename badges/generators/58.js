generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();
    ctx.translate( s/2, s/2 );
    ctx.scale( Math.sqrt( 2 ) * .5,  0.25 );
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

        ctx.beginPath();
        for( j = -s; j <= s*2; j += step ){

            p.set( i, j );
            if( getDistance( or, p ) > s * Math.sqrt( 2 ) * .5 )continue;
            n = Math.abs( PRNG.FBM( i * sca, j * sca, oct ) * PRNG.FBM( ( s - j ) * sca, i * sca, oct * 2 ) );
            offset = ( n ) * amp;
            ctx.lineTo( i - offset, j - offset );

            ctx.globalAlpha = n;
            ctx.lineTo( i, j );

        }
    ctx.stroke();
    }
    ctx.restore();

};
