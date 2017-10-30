generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    var turns = 10;
    var total = Math.PI * 2  * turns;
    var minRadius = s/5;
    var maxRadius = minRadius + s/5;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;

    var i = 0;
    var points = [];
    ctx.save();
    ctx.translate( s/2,s/2 );
    for ( var angle = 0; angle <= total; angle+=ga ){

        var radius = map( angle, 0, total, minRadius, maxRadius );
        var x = Math.cos( angle ) * radius * .62;
        var y = Math.sin( angle ) * radius;

        var ang = ( PRNG.random() * Math.PI * 2 );
        x += Math.cos( ang ) * radius * .62;
        y += Math.sin( ang ) * radius;
        points.push( [x, y] );


    }

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2 * unit;
    ctx.lineJoin = "round";
    var convex = hull(points, 40 * unit );
    // g.polyline(convex, true);

    points = convex.map( function( p, i, a ){

        var sca = 0.001;
        var x = a[i][0] * sca;
        var y = a[i][1] * sca;
        var z0 = PRNG.FBM(x,y,3 ) * 100;
        return new Point( a[i][0], a[i][1], z0 );

    });

    ctx.fillStyle = "#000";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1 * unit;
    ctx.lineJoin = "round";


    var ecp = [];
    convex.forEach(function(p){ ecp.push( p[0], p[1 ] ); } );
    var tris = earcut( ecp );
    
    var light = new Point( 0, -100, 100 ).normalize();
    for( i = 0; i < tris.length; ){

        var a = points[ tris[i++] ];
        var b = points[ tris[i++] ];
        var c = points[ tris[i++] ];
        var normal = cross(c.clone().sub(a), c.clone().sub(b)).normalize();
        ctx.globalAlpha = .25;
        drawTri( ctx, a,b,c );
        ctx.stroke()

        ctx.globalAlpha = map(light.dot(normal), -1, 1, 0.75, .0);
        ctx.fill();
    }

    function drawTri( ctx, a, b, c ){

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.lineTo(a.x, a.y);

    }

    ctx.restore();

    return LANDSCAPE;
};