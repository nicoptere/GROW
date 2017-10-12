generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var points = [];
    var a = PI * 0.5;
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

        g.bezierCurve( d, ad, p, ae );
        g.bezierCurve( ae, p, e, ad );

    }

};