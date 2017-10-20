
generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();

    var c = new Point(s/2, s/2);
    c.radius = s / 4;

    var t = Date.now() * 0.001;
    var p = new Point();
    var n = new Point();
    var RAD = Math.PI / 180;

    ctx.lineWidth = 5 * unit;
    for( var i = 0; i <  Math.PI * 2; i += RAD ){

        p.x = c.x + Math.cos( i ) * c.radius;
        p.y = c.y + Math.sin( i ) * c.radius;

        var radius = c.radius * ( ( Math.sin( t + i * 3  )* Math.cos( t ) )  * .5 + .5 ) * 2 ;
        n.x = c.x + Math.cos( i + RAD * 30 ) * radius;
        n.y = c.y + Math.sin( i + RAD * 30 ) * radius;

        var grad = ctx.createRadialGradient( p.x,p.y, 0,p.x,p.y, Math.abs( radius ) );
        grad.addColorStop( 0, "rgba(0,0,0, 1 )" );
        grad.addColorStop( 1, "rgba(0,0,0, 0 )" );
        ctx.strokeStyle = grad;

        g.line(p,n);

    }

    ctx.restore();

};