generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var points = [];
    var a = PI ;
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

        ctx.globalAlpha = .1;
        ctx.lineWidth = unit;
        p = d.pointAt( t, ae );
        g.bezierCurve( e.pointAt( t,ae ), ae, ad, p );

        p = e.pointAt( t, ad );
        g.bezierCurve( d.pointAt( t,ad ), ad, ae, p );
    }

    return PORTRAIT;
};