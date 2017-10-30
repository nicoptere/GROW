generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var points = [];
    var a = PI * .5;
    var c = new Point(s/2, s/2);
    var d = pointAtAngleRadius(a, Math.sqrt(2) * s / 4).add( c);
    var ad = pointAtAngleRadius(a-PI/2, Math.sqrt(2) * s / 4).add( c);
    var e = pointAtAngleRadius(a+PI, Math.sqrt(2) * s / 4).add( c);
    var ae = pointAtAngleRadius(a+PI/2, Math.sqrt(2) * s / 4).add( c);

    ctx.lineCap =
    ctx.lineJoin = "butt";
    var ran = PRNG.random();
    ctx.globalAlpha = .05;
    for ( var i = 0; i < 100; i++  ){

        var r = i/100;
        var t = PRNG.random();
        var p = d.pointAt( t, e );
        points.push( p );

        ctx.globalAlpha = .05;
        ctx.lineWidth = r * 20 * unit;
        g.bezierCurve( d, ad, p, ae );
        ctx.fill();

        ctx.lineWidth = unit * 2;
        p = e.pointAt( t, ad );
        p.y = 0;
        g.bezierCurve( d.pointAt( t,ad ), ad, ae, p );
        g.disc( p, 2 * unit)
    }

    return LANDSCAPE;

};