
generators[ genId++ ] = function( g, ctx, s, seed, unit ){

    PRNG.setSeed( seed || 0 );

    var turns = 5;
    var total = Math.PI * 2  * turns;
    var minRadius = s/5;
    var maxRadius = minRadius + s/5;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;
    var points = [];
    var i=0;
    ctx.save();
    ctx.translate( s/2,s/2 );


    var weights = [];
    for ( var angle = 0; angle <= total; angle+=ga ){

        var radius = map( angle, 0, total, minRadius, maxRadius );
        var x = Math.cos( angle ) * radius * .75;
        var y = Math.sin( angle ) * radius;
        points.push([x,y]);

        g.disc( x,y, 2* unit );
        ctx.moveTo(x,y);
        var sca = .0005;
        var ang = ( PRNG.FBM( x * sca, y * sca ) * Math.PI * 4 ) + Date.now() * 0.001;

        x += Math.cos( ang ) * radius * .25;
        y += Math.sin( ang ) * radius * .25;
        ctx.lineTo(x,y);
        points.push([x,y,0]);
        weights.push(0);


    }
    // ctx.stroke();

    var delaunay = new Delaunator( points );
    var tris = delaunay.triangles;
    for( i = 0; i < tris.length; ){
        grow( ctx, points, tris[i++], tris[i++], tris[i++]);
    }
    var max = weights.reduce( function( a,b ){
        if( isNaN(b) )return a;
        return Math.max( a,b );
    },0 );

    points.forEach(function( p, i ){
        ctx.globalAlpha = 1 - weights[i]/max;
        g.disc( p[0],p[1], unit + unit * weights[i] );
    });

    for( i = 0; i < tris.length; ){
        drawTri( ctx, points, tris[i++], tris[i++], tris[i++]);
    }

    function grow( ctx, ps, a, b, c ){
        weights[a] += unit;
        weights[b] += unit;
        weights[c] += unit;
        ps[a][2] += 1;
        ps[b][2] += 1;
        ps[c][2] += 1;
    }
    function drawTri( ctx, ps, a, b, c ){

        ctx.beginPath();

        ctx.globalAlpha = 1 - Math.sqrt( ( weights[a]+weights[b]+weights[c] ) / max / 3 );


        // var a =new Point( ps[a][0], ps[a][1], ps[a][2] );
        // var b =new Point( ps[b][0], ps[b][1], ps[b][2] );
        // var c =new Point( ps[c][0], ps[c][1], ps[c][2] );
        //
        // if( a==undefined || b == undefined || c == undefined){
        //     return;
        // }
        // var light = new Point( 0,100, 100 ).normalize();
        // var normal = cross( c.clone().sub( a ), c.clone().sub( b ) ).normalize();
        // ctx.globalAlpha = map( light.dot( normal ), -1, 1, 0.75, .0 );


        ctx.moveTo(ps[a][0], ps[a][1]);
        ctx.lineTo(ps[b][0], ps[b][1]);
        ctx.lineTo(ps[c][0], ps[c][1]);
        ctx.lineTo(ps[a][0], ps[a][1]);
        ctx.stroke()


    }
    ctx.restore();

}
