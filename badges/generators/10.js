generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    // ctx.save();
    // ctx.translate( s/2,s/2 + s/  3  );
    //
    // var sy = .5;
    // ctx.scale( 1, .5 );
    //
    // ctx.fillStyle = "#FFF";
    // var step = ( ( s/3 ) * 2 ) / 100;
    // for( var i = -( s/3 ); i < ( s/3 ); i+= step ){
    //
    //     ctx.translate( 0, -step * ( 1 / sy ) );
    //
    //
    //     var r = Math.sin( norm( i, -s/3, s/3 ) );
    //     ctx.beginPath();
    //     ctx.arc( 0, 0, r * s / 3, 0, Math.PI * 2);
    //     ctx.fill();
    //     ctx.stroke();
    //
    // }
    // ctx.fillStyle = "#000";
    // ctx.restore();

    var sy = .5;
    ctx.save();
    ctx.fillStyle = "#FFF";
    var oy = s/2 + s/3;
    var step = ( ( s/3 ) * 2 ) / 100;
    for( var i = -( s/3 ); i < ( s/3 ); i+= step ){

        var r = Math.sin( norm( i, -s/3, s/3 ) );
        oy -= .45 * step * ( 1 / sy );
        ctx.beginPath();
        ctx.ellipse( s/2, oy, r * s / 3 , r * s / 3 * .5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();

    }
    ctx.fillStyle = "#000";
    ctx.restore();

    return LANDSCAPE;


}
