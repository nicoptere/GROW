generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var points = [];
    var a = PI * .5;
    var c = new Point(s/2, s/2);
    var d = pointAtAngleRadius(a, Math.sqrt(2) * s / 4).add( c);
    var ad = pointAtAngleRadius(a-PI/2, Math.sqrt(2) * s / 4).add( c);
    var e = pointAtAngleRadius(a+PI, Math.sqrt(2) * s / 4).add( c);
    var ae = pointAtAngleRadius(a+PI/2, Math.sqrt(2) * s / 4).add( c);
    // g.circle(d, unit * 50);
    // g.circle(ad, unit * 50);
    // g.circle(e, unit * 50);
    // g.circle(ae, unit * 50);

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
        ctx.lineWidth = unit * r * 20 * unit;
        g.bezierCurve( d, ad, p, ae );
        ctx.fill()

        ctx.lineWidth = unit * 2 * unit;
        p = e.pointAt( t, ad );
        p.y = 0;
        g.bezierCurve( d.pointAt( t,ad ), ad, ae, p );
g.disc( p, 2)
    }

    // var radiusIn = s/4;
    // var normal = s / 20 + ( PRNG.random() * s/100 );
    // var radiusOut = normal * 1.5 ;// normal * ( 2 *  PRNG.random() );
    //
    // ctx.globalAlpha = .1 * unit;
    // ctx.save();
    // ctx.translate(s/2, s/2);
    // ctx.lineWidth = 1 * unit;
    // ctx.globalAlpha = .1;// * unit;
    // var circle = new Circle( 25, normal, radiusIn, radiusOut );
    // for( var i = 0; i < 40; i++  ){
    //
    //     circle.update( s, true );
    //     circle.render(ctx, unit);
    //     ctx.stroke();
    //
    // }
    // ctx.restore();

};