generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var points = [];
    var a = PRNG.random() * PI * 2;
    var c = new Point(s/2, s/2);
    var d = pointAtAngleRadius(a, Math.sqrt(2) * s / 4).add( c);

    var ad = pointAtAngleRadius(a-PI/2, Math.sqrt(2) * s / 4).add( c);
    var e = pointAtAngleRadius(a+PI, Math.sqrt(2) * s / 4).add( c);
    var ae = pointAtAngleRadius(a+PI/2, Math.sqrt(2) * s / 4).add( c);
    // g.circle(d, unit * 50);
    // g.circle(ad, unit * 50);
    // g.circle(e, unit * 50);
    // g.circle(ae, unit * 50);

    d.set( 0,0 );
    e.set( s,0 );


    var segments = [];
    for ( var i = 0; i < 100; i++  ){

        var x = s/2 + ( PRNG.random() - .5 ) * s / 2;
        var y = s/2 + ( PRNG.random() - .5 ) * s / 2;

        var a = PRNG.random() * 2 * Math.PI;
        var l = 10*unit + PRNG.random() * 50*unit;

        segments.push( [
            new Point( x - Math.cos( a ) * l, y - Math.sin( a ) * l ),
            new Point( x + Math.cos( a ) * l, y + Math.sin( a ) * l ),
        ] )

    }

    segments.forEach(function( s ){
        g.line( s[0], s[1])
        g.disc( s[0], 2 )
        g.disc( s[1], 2 )
    })

    ctx.lineCap = ctx.lineJoin = "butt";
    var ran = PRNG.random();
    var segs = [];
    ctx.globalAlpha = .1;
    for ( var i = 0; i < 100; i++  ){

        var r = i/100;
        var t = PRNG.random();
        // var p = d.pointAt( t, e );
        // var ep = new Point(p.x, s);


        var a = PRNG.random() * 2 * Math.PI;
        // var p = pointAtAngleRadius(a, Math.sqrt(2) * s / 4).add( c);
        // var ep = pointAtAngleRadius(a+PI, Math.sqrt(2) * s / 4).add( c);

        var l = 10*unit + PRNG.random() * 20*unit;
        var x = s/2 + ( PRNG.random() - .5 ) * s;
        var y = s/2 + ( PRNG.random() - .5 ) * s;

        p = new Point( x - Math.cos( a ) * l, y - Math.sin( a ) * l )
        ep = new Point( x + Math.cos( a ) * l, y + Math.sin( a ) * l )
        points.push( p );

        g.line( p, ep );

        // g.disc(p,10 * unit)


        // console.log (ip )
        // if( ip === undefined ) {
        //     ip = new Point(p.x, s);
        // }
        // g.line( p, ip );
        // g.disc( ip, 5 );

        segs.push( [p, ep ])


    }
    segs.forEach( function (seg0){

        var ints = [];
        segments.forEach(function (s){

            var tip = geomUtils.lineIntersectLine( seg0[0],seg0[1], s[0], s[1], false, true );

            if( tip != null ){
                ints.push( tip )
            }

        });

        if( ints.length === 0 )return;

        ints.sort( function( a, b ){
            return getDistance( seg0[0], a ) - getDistance( seg0[0], b );
        });


        var c = ints.length;
        var t = ints.length;
        while( c-- ){

            // console.log (ints)
            var ip = ints.shift();
            // ctx.lineWidth = c/t * 2 * unit;
            ctx.globalAlpha = c/t ;
            g.disc( ip, 10 * unit * c/t  );
            g.line( seg0[0], ip );
        }

    })
    return PORTRAIT;

};