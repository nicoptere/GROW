
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

    var o = new Point( s/2, -s );
    var e = new Point( s/2, s );


    var k = 50;
    while( k-- ){
        repel( points, points );
    }


    var voronoi = new Voronoi();
    var bbox = {xl: -s, xr: s, yt: -s, yb: s};
    var diagram = voronoi.compute( points, bbox);
    var cells = [];
    var center = new Point( s/2, s/2 );
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

        // var d = getDistance( center, cell.site );
        // if( d - s / 5 < 0 ){
        var dx = Math.abs( ( s/2 - cell.site.x ) / s );
        var dy = Math.abs( cell.site.y / s );
        if( dx < 0.15 ){



            if( dy < .75 ){
                var r = ( 1 + dy * 5 ) * unit;
                cells.push( {center:cell.site, radius:r, points:convex } );
            }


            // ctx.globalAlpha = .15;

            // ctx.globalAlpha = .5;
            // convex.forEach(function (p) {
            //     g.disc( p, r * 0.5 )
            // } );
            if( PRNG.random()>.5 ){
                
                ctx.globalAlpha = 1;
                g.disc( cell.site, Math.max( unit, Math.sin( dy * PI ) * 6 * unit ) );
            }
        }

        if( dx > .15 ){

            ctx.globalAlpha = ( Math.sin( dy * PI ) ) * .15;
            g.polygon( convex, true );
        }


    } );


    function findPath( o, e, cells ){

        var p = o.clone();
        var path = [];
        // path.push( o );
        var over = false;
        while( !over ){
            var tmp = [];
            cells.forEach(function(c){
                // if( c.center.x > p.x )tmp.push( c.points );
                if( c.center.y > p.y )tmp.push( c );
            });

            if( tmp.length === 0 ) break;

            var cell = tmp[~~( PRNG.random()  * tmp.length ) ];
            // g.line( p, cell.center )
            p.copy( cell.center );//cell.points[ ~~( PRNG.random()  * cell.points.length ) ] );

            if( path.length === 0 )path.push( new Point( p.x, 0 ));
            path.push( p.clone() );


        }

        path.push( new Point( path[ path.length - 1 ].x, s * 2 ) );

        return path;


    }

    var curve = new CubicPath(.01, 0, 1 );

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    var k = 100;
    while( k-- ){

        var path = findPath( o, e, cells );
        ctx.globalAlpha = .15;
        ctx.lineWidth = ( 1 + PRNG.random() ) * unit;
        if( path.length < 7 )continue;

        g.polyline( path );//curve.compute( path, .02, false ), false);

    }

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
    return PORTRAIT;

};
