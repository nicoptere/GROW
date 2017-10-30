
generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();

    ctx.lineCap = 'round';
    var c = new Point( s * .5, s * .5  );
    c.radius = s / 2.5;
    g.disc(c, c.radius );


    var p = new Point();
    var n = new Point();
    var RAD = Math.PI / 180;

    ctx.lineWidth = 20 * unit;
    var sa = -PI / 4;
    var it = 0;
    var step = RAD * .1;
    var tot = PI2 / step;
    var sca = 0.005 / unit;
    ctx.globalAlpha = 0.05;

    for( var i = sa; i < sa + Math.PI * 2; i += step ){

        var angle = i;
        p.x = c.x + Math.cos( angle ) * c.radius;
        p.y = c.y + Math.sin( angle ) * c.radius;

        var t =  noise.perlin3( p.x * sca, p.y * sca, it++/tot ) * 7.5;
        var radius = c.radius * t;
        n.x = c.x + Math.cos( angle + RAD * t * 30 ) * radius;
        n.y = c.y + Math.sin( angle + RAD * t * 30 ) * radius;

        n = geomUtils.closestPointOnCircle(n,c);

        var grad = ctx.createRadialGradient( p.x,p.y, 0, p.x,p.y, Math.abs( radius * .5 ) );
        grad.addColorStop( 0, "rgba(255,255,255, 1 )" );
        grad.addColorStop( 1, "rgba(255,255,255, 0 )" );
        ctx.strokeStyle = grad;

        g.line(p,n);

    }
    ctx.restore();
    return PORTRAIT;

};