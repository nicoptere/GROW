generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    ctx.save();
    ctx.translate( s/2,s/2 + s/  3  );

    var sy = .5;
    ctx.scale( 1, .5 );

    var radiusIn = s/5;
    var normal = s / 30 + ( PRNG.random() * s/100 );
    var radiusOut = normal * ( 2 + PRNG.random() );

    var circle = new Circle( 32, normal, radiusIn, radiusOut );

    var radius = s/4;
    for( var i = 0; i < 100; i++ ){

        var t = ( i / 100 );

        var y =  radius * .38 - t * radius * 2;

        var r = 1 - Math.pow( t, .75 );//1 - Math.sin( t * t * t * Math.PI * 3 );

        ctx.restore();
        ctx.save();
        ctx.globalAlpha = .1;
        ctx.translate( s/2, s/2 + y );
        ctx.scale( r, .5 );
        circle.update( s, true );
        circle.render(ctx, unit);
        ctx.fill();
        ctx.stroke();

    }
    ctx.fillStyle = "#000";
    ctx.restore();

    return LANDSCAPE;
}
