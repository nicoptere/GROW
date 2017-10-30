
generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();


    var points = [];
    var count = 10;
    var cell = s/count;
    for( var i = 0; i< count; i++ ){

        for( var j = 0; j< count; j++ ){


            var x = i * cell + PRNG.random() * cell - s/2;
            var y = j * cell + PRNG.random() * cell - s/2;

            var p = new Point( x,y );
            points.push( p );

        }

    }


    var voronoi = new Voronoi();
    var bbox = {xl: -s, xr: s, yt: -s, yb: s};
    var diagram = voronoi.compute( points, bbox);
    diagram.cells.forEach(function(cell){
        // g.disc( cell.site, 2 );
    });

    // ctx.beginPath();
    // diagram.edges.forEach(function(e){
    //     ctx.moveTo(e.va.x, e.va.y);
    //     ctx.lineTo(e.vb.x, e.vb.y);
    // });
    // ctx.stroke();

    ctx.translate( s/2,s/2 )
    ctx.rotate( PI / 4 )

    var center = new Point( 0,0 );//s/2, s/2 )
    diagram.cells.forEach(function(cell, i){

        // if( i !== 20 )return;
        if( cell.site === undefined )return;

        var poly = [];
        cell.halfedges.forEach(function( he ){

            poly.push( [ he.edge.va.x, he.edge.va.y ] );
            poly.push( [ he.edge.vb.x, he.edge.vb.y ] );

        });

        var convex = hull(poly, s ).map( function( v ){
            var p = new Point( v[0], v[1], PRNG.random() * s/2 );
            p.r = PRNG.random() * s/2;
            return p;
        } );

        var d = getDistance( center, cell.site );
        if( d - s / 5 > 0 ){
            var k = 250;
            ctx.globalAlpha = 0.02;// / k;

            while( k-- ) {

                // g.polyline(convex, true);
                var sca = 0.005 / unit;
                convex.forEach(function (p) {
                    p.x += PRNG.FBM( p.x * sca, p.y * sca, 2 ) * .1 * unit;
                    p.y += PRNG.FBM( p.z * sca, p.r * sca, 2 ) * .1 * unit;
                });
                repel(convex, convex );
                g.polyline(convex, true);

            }
        }


    } );


    function repel(a, b) {

        var acc = 0;
        var sca = 0.001 / unit;
        a.forEach(function (circle) {
            circle.x += PRNG.FBM(circle.x * sca, circle.y * sca, 5 ) * unit;
            circle.y += PRNG.FBM(circle.y * sca, circle.x * sca, 5 ) * unit;
        });
        a.forEach(function (circle) {

            b.forEach(function (other) {

                if (circle === other) return;

                var p = circle;
                var o = other;

                var d = geomUtils.distance(p, o);
                var minDist = circle.r + other.r;

                if (d < minDist) {

                    var dir = p.direction(o).multiplyScalar(-.01 * unit);
                    dir.z = 0;
                    p.sub(dir);
                    o.add(dir);
                }

            });

        });
        return acc;
    }
    ctx.restore()
    return LANDSCAPE;

};
