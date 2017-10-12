
generators[ genId++ ] = function( g, ctx, s, seed, unit ){

    PRNG.setSeed( seed || 0 );

    ctx.save();
    ctx.translate( s/2, s/2 );
    ctx.scale( 1.,  0.5);
    ctx.rotate( Math.PI / 4 );
    ctx.translate(-s/2, -s/2 );

    var step = s / 100;
    ctx.globalAlpha = .1;

    var sca = 5 / s;
    var oct = 8;
    var amp = s / 10;

    ctx.globalAlpha = .5;
    ctx.beginPath();
    for( i = 0; i <= s; i += step * 2 ){
        for( var j = 0; j <= s; j += step * 2 ){
            var n = PRNG.FBM( i * sca, j * sca, oct );
            var offset = ( n ) * amp;
            g.disc( i - offset, j - offset , Math.abs(1+n ) * 3 * unit );
        }
    }

    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for( i = 0; i <= s; i += step ){
        for( j = 0; j <= s; j += step ){
            n = PRNG.FBM( i * sca, j * sca, oct );
            offset = ( n ) * amp;
            ctx.moveTo( i - offset, j - offset );
            ctx.lineTo( i, j );
        }
    }
    ctx.stroke();
    ctx.restore();

}