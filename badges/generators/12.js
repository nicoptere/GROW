generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    ctx.save();
    ctx.translate( s/2,s/2 + s/  3  );

    var sy = .5;
    ctx.scale( 1, .5 );

    ctx.fillStyle = "#FFF";
    var step = ( ( s/3 ) * 2 ) / 100;
    for( var i = -( s/3 ); i < ( s/3 ); i+= step ){

        ctx.translate( 0, -step * ( 1 / sy ) );

        var r = Math.sin( map( i, -s/3, s/3, 0, Math.PI ) );

        ctx.beginPath();
        var nx = PRNG.FBM( i * 0.01, r, 6 ) * 20;
        ctx.rect( nx, 0, r * s / 3, r * s / 3);
        ctx.fill();
        ctx.stroke();

    }
    ctx.fillStyle = "#000";
    ctx.restore();

}
