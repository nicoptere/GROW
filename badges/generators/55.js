generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);
    noise.seed(PRNG.random());

    ctx.save();


    var points = Poisson.distribute(10000, s/50, s,s );

    var sca = 0.005 / unit;
    var ps = [];
    points.forEach(function( p ){
        var r = 8 * unit * Math.abs( noise.perlin2( p.x*sca, p.y*sca ) );
        g.disc(p, r );
        ps.push( [p.x, p.y, r ])
    });


    var delaunay = new Delaunator( ps );
    var tris = delaunay.triangles;

    var pa = new Point();
    var pb = new Point();
    var pc = new Point();
    for( var i = 0; i < tris.length; ){

        ctx.beginPath();

        var a = tris[i++];
        var b = tris[i++];
        var c = tris[i++];

        pa.set( ps[a][0], ps[a][1],0 );
        pb.set( ps[b][0], ps[b][1],0 );
        pc.set( ps[c][0], ps[c][1],0 );

        r = ( noise.perlin2( pa.x*sca, pa.y*sca ) );
        if( r < .0 )continue;

        // if( getDistance(pa, pb ) > s/40 )continue;
        // if( getDistance(pb, pc ) > s/40 )continue;
        // if( getDistance(pa, pc ) > s/40 )continue;

        ctx.globalAlpha = r * .5;
        drawTri( ctx, ps, a, b, c );
        ctx.stroke();

    }

    function drawTri( ctx, ps, a, b, c ) {


        ctx.moveTo(ps[a][0], ps[a][1]);
        ctx.lineTo(ps[b][0], ps[b][1]);
        ctx.lineTo(ps[c][0], ps[c][1]);
        ctx.lineTo(ps[a][0], ps[a][1]);

    }

    ctx.restore();
    return LANDSCAPE;

};
