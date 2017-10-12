generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var turns = 5;
    var total = Math.PI * 2  * turns;
    var minRadius = s/5;
    var maxRadius = minRadius + s/5;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;
    var points = [];
    var i=0;
    ctx.save();
    ctx.translate( s/2,s/2 );
    for ( var angle = 0; angle <= total; angle+=ga ){

        var radius = map( angle, 0, total, minRadius, maxRadius );
        var x = Math.cos( angle ) * radius * .75;
        var y = Math.sin( angle ) * radius;
        points.push([x,y]);
        ctx.moveTo(x,y);
        var sca = .0005;
        var ang = ( PRNG.FBM( x * sca, y * sca ) * Math.PI * 4 ) + PRNG.random();
        x += Math.cos( ang ) * radius * .25;
        y += Math.sin( ang ) * radius * .25;
        ctx.lineTo(x,y);
        points.push([x,y]);


    }

    var delaunay = new Delaunator( points );
    var tris = delaunay.triangles;
    var centers = [];
    ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle = "#000";

    for( i = 0; i < tris.length; ){

        if( PRNG.random() > .5 ){
            i+=3;
            continue;
        }

        var a = tris[i++];
        var b = tris[i++];
        var c = tris[i++];

        if( areaABC( a,b,c ) < 50 * unit ){
            continue;
        }

        var dt = drawTri( ctx, points, a,b,c );
        if( dt === false ){
            var pa = new Point(points[a][0], points[a][1]);
            var pb = new Point(points[b][0], points[b][1]);
            var pc = new Point(points[c][0], points[c][1]);

            var da = geomUtils.distance( pb,pc );
            var db = geomUtils.distance( pa,pc );
            var dc = geomUtils.distance( pa,pb );
            var pe = da+db+dc;

            //incenter
            var ix = ( da* pa.x + db * pb.x + dc * pc.x ) / pe;
            var iy = ( da* pa.y + db * pb.y + dc * pc.y ) / pe;

            //centroid
            var cx = ( points[a][0] + points[b][0] + points[c][0] ) / 3;
            var cy = ( points[a][1] + points[b][1] + points[c][1] ) / 3;

            var p = new Point( ix, iy );
            p.radius = Math.min(
                geomUtils.distance( p, geomUtils.project( p, pa,pb ) ),
                Math.min(
                    geomUtils.distance( p, geomUtils.project( p, pb,pc ) ),
                    geomUtils.distance( p, geomUtils.project( p, pc,pa ) )
                )
            );
            centers.push( p );
        }

    }
    ctx.fill();
    ctx.fillStyle = "#FFF";
    centers.forEach( function(p,i){

        g.disc(p,p.radius );
    } );
    ctx.restore();


    function drawTri( ctx, ps, a, b, c ){


        ctx.moveTo(ps[a][0], ps[a][1]);
        ctx.lineTo(ps[b][0], ps[b][1]);
        ctx.lineTo(ps[c][0], ps[c][1]);
        ctx.lineTo(ps[a][0], ps[a][1]);

        return false;

    }
}