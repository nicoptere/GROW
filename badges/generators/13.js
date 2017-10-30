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

        var y = radius - t * radius * 2;

        var r = Math.sin( t * Math.PI );

        ctx.restore();
        ctx.save();
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000000";

        ctx.translate( s/2, s/2 + y );
        ctx.scale( lerp( 1-t, t, r*r ), .5 );


        circle.update( s, true );
        circle.render(ctx, unit);
        ctx.globalAlpha = .1 / t;// * unit;
        ctx.fill();

        ctx.globalAlpha = .75;// * unit;
        ctx.stroke();

    }
    ctx.fillStyle = "#000";
    ctx.restore();

    return LANDSCAPE;
}
