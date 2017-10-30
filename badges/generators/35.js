generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    var turns = 10;
    var total = Math.PI * 2  * turns;
    var minRadius = s/5;
    var maxRadius = minRadius + s/5;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;

    var i = 0;
    var points = [];
    var sources = [];
    ctx.save();
    ctx.translate( s/2,s/2 );
    for ( var angle = 0; angle <= total / 3; angle+=ga ){

        var radius = map( angle, 0, total, minRadius, maxRadius );
        var x = Math.cos( angle ) * radius;
        var y = Math.sin( angle ) * radius * .62;

        var ang = ( PRNG.random() * Math.PI * 2 );
        x += Math.cos( ang ) * radius;
        y += Math.sin( ang ) * radius * .62;
        points.push( [x, y] );

        radius = s * Math.sqrt( 2 );
        // angle = PRNG.random() * PI2
        x = Math.cos( angle ) * radius;
        y = Math.sin( angle ) * radius;
        var p = new Point( x,y );
        sources.push( p );

    }

    ctx.fillStyle = "#000";

    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2 * unit;
    ctx.lineJoin = "round";


    var convex = hull(points, 40 );
    // g.polyline(convex, true);

    convex = [];
    var step = PI / 15;
    for ( angle = PI / 2; angle <= PI2 * 2.5; angle+=step){

        radius = map( angle, 0, PI2 * 2.5, s/100, s / 4 );
        x = Math.cos( angle ) * radius;
        y = Math.sin( angle ) * radius;
        convex.push( [x,y] );
    }

    var segs = convex.map( function( p, i, a ){
        return [ new Point( a[i][0], a[i][1] ), new Point( a[( i+1) % a.length ][0], a[( i+1) % a.length ][1] ) ];
    });

    ctx.strokeStyle = "#000";

    var c = new Point(0,0);
    segs.forEach( function (s) {
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2 * unit;
        ctx.globalAlpha = .25;
        ctx.lineWidth = .5 * unit;
        sources.forEach(function( p ){

            var bv = geomUtils.bounceVector( p, c, s[0], s[1] );
            if( bv != null ){
                g.line( bv[0], bv[1] );
            }

        })

    });

    ctx.fillStyle = "#FFF";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 10 * unit;
    ctx.lineJoin = "round";


    ctx.globalAlpha = 1;
    function drawTri( ctx, ps, a, b, c ){

        ctx.beginPath();
        ctx.moveTo(ps[a][0], ps[a][1]);
        ctx.lineTo(ps[b][0], ps[b][1]);
        ctx.lineTo(ps[c][0], ps[c][1]);
        ctx.lineTo(ps[a][0], ps[a][1]);
        ctx.stroke()

    }

    ctx.restore();
    return LANDSCAPE;

};