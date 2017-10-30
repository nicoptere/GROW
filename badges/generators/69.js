
generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();


    var points = [];
    var count = 10;
    var cell = s/count;
    for( var i = 0; i< count; i++ ){

        for( var j = 0; j< count; j++ ){


            var x = i * cell + PRNG.random() * cell;
            var y = j * cell + PRNG.random() * cell;


            var p = new Point( x,y );
            points.push( p );

        }

    }


    var voronoi = new Voronoi();
    var bbox = {xl: -s, xr: s, yt: -s, yb: s};
    var diagram = voronoi.compute( points, bbox);

    var center = new Point( s/2, s/2 )
    diagram.cells.forEach(function(cell, i){

        // if( i !== 20 )return;
        if( cell.site == undefined )return;

        var poly = [];
        cell.halfedges.forEach(function( he ){

            poly.push( [ he.edge.va.x, he.edge.va.y ] );
            poly.push( [ he.edge.vb.x, he.edge.vb.y ] );

        });

        var convex = hull(poly, s ).map( function( v ){
            var p = new Point( v[0], v[1], 0 );
            p.r = s/2;
            return p;
        } );

        var d = getDistance( center, cell.site );
        if( d - s / 3 < 0 ){
            var k = 100;
            ctx.globalAlpha = ( 1 / k );
            while( k-- ){
                repel(convex, convex );
                g.polygon(convex, true);
            }
        }

    } );


    function repel(a, b) {

        var acc = 0;
        var dirs = [];
        var sca = 0.005 / unit;
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

                    var dir = p.direction(o).multiplyScalar( .01 * unit);
                    dir.z = 0;
                    p.sub(dir);
                    o.add(dir);
                }

            });

        });
        return acc;
    }
    ctx.restore();
    return PORTRAIT;

};
