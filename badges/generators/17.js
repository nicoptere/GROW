generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var radiusIn = s/5;
    var normal = s / 20 + ( PRNG.random() * s/100 );
    var radiusOut = normal * ( 3 + PRNG.random() );

    var circle = new Circle( 7, normal, radiusIn, radiusOut );
    ctx.save();
    ctx.translate(s/2, s/2);
    for( var i = 0; i < 100; i++  ){

        circle.update( s, true );
        circle.render(ctx, unit);

        ctx.lineWidth = PRNG.random() * 5 * unit;
        ctx.globalAlpha = .1;
        ctx.stroke();
    }
    ctx.restore();

    return PORTRAIT;
}