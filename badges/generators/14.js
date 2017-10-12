generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var radiusIn = s/4;
    var normal = s / 20 + ( PRNG.random() * s/100 );
    var radiusOut = normal * 1.5 ;// normal * ( 2 *  PRNG.random() );

    ctx.globalAlpha = .1 * unit;
    ctx.save();
    ctx.translate(s/2, s/2);
    ctx.lineWidth = 1 * unit;
    ctx.globalAlpha = .1;// * unit;
    var circle = new Circle( 25, normal, radiusIn, radiusOut );
    for( var i = 0; i < 40; i++  ){

        circle.update( s, true );
        circle.render(ctx, unit);
        ctx.stroke();

    }
    ctx.restore();
}