generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    // ctx.save();
    // ctx.translate( s/2,s/2 + s/  3  );
    // //TODO fix line width
    // ctx.scale( 1, .1 );
    //
    // ctx.fillStyle = "#FFF";
    // var step = ( ( s/3 ) * 2 ) / 100;
    // for( var i = -( s/3 ); i < ( s/3 ); i+= step ){
    //
    //     ctx.translate( 0, -step * 10 );
    //
    //     var r = Math.asin( norm( i, -s/3, s/3 ) * Math.PI );
    //     ctx.beginPath();
    //     ctx.arc( 0, 0, r * s / 3, 0, Math.PI * 2);
    //     ctx.fill();
    //     ctx.stroke();
    //
    // }
    // ctx.fillStyle = "#000";
    // ctx.restore();

    ctx.save();
    // ctx.globalAlpha = .5
    ctx.fillStyle = "#FFF";
    var step = ( ( s/3 ) * 2 ) / 100;
    for( var i = -( s/3 ); i < ( s/3 ); i+= step ){

        var r = Math.asin( norm( i, -s/3, s/3 ) * Math.PI );
        ctx.beginPath();
        ctx.ellipse( s/2, s / 3 + s / 6 - i , r * s / 3 , r * s / 3 * .1, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();

    }
    ctx.fillStyle = "#000";
    ctx.restore();

    return PORTRAIT;

}
