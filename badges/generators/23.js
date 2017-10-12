generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);

    var a = PRNG.random() * PI * 2;
    var c = new Point(s/2, s/2);
    var d = pointAtAngleRadius(a, Math.sqrt(2) * s / 4).add( c);

    var ad = pointAtAngleRadius(a-PI/2, Math.sqrt(2) * s / 4).add( c);
    var e = pointAtAngleRadius(a+PI, Math.sqrt(2) * s / 4).add( c);
    var ae = pointAtAngleRadius(a+PI/2, Math.sqrt(2) * s / 4).add( c);

    d.set( 0,0 );
    e.set( s,0 );


    var segments = [];
    for ( var i = 0; i < 100; i++  ){

        var x = s/2 + ( PRNG.random() - .5 ) * s / 4;
        var y = s/2 + ( PRNG.random() - .5 ) * s / 4;

        var a = PRNG.random() * 2 * Math.PI;
        var l = s/ 4 * unit + PRNG.random() * 50*unit;

        segments.push( [
            new Point( x - Math.cos( a ) * l, y - Math.sin( a ) * l ),
            new Point( x + Math.cos( a ) * l, y + Math.sin( a ) * l ),
        ] )

    }

    ctx.globalAlpha = .5;
    segments.forEach(function( s ){
        g.line( s[0], s[1]);
        g.disc( s[0], unit );
        g.disc( s[1], unit );
    });

    var points = [];
    segments.forEach( function (seg0, i){

        var ints = [];
        segments.forEach(function (s, j){

            if( i==j )return;

            var tip = geomUtils.lineIntersectLine( seg0[0],seg0[1], s[0], s[1], true, true );

            if( tip != null ){
                ints.push( tip )
            }

        });

        g.line( seg0[0], seg0[1] );

        if( ints.length === 0 )return;

        ints.sort( function( a, b ){
            return getDistance( seg0[0], a ) - getDistance( seg0[1], b );
        });


        var c = ints.length;
        var t = ints.length;
        while( c-- ){

            var ip = ints[0];
            ints.push( ints.shift());
            ctx.globalAlpha = 1;
            g.disc( ip, 2 * unit );
            points.push( ip );
        }
        ctx.globalAlpha = .1;
        g.line( ints[0], ints[ints.length - 1 ] );

    });

    var voronoi = new Voronoi();
    var bbox = {xl: -s, xr: s, yt: -s, yb: s};
    // var sites = points.map( function( a ){ return { x:a.x, y:a.y }; } );

    var diagram = voronoi.compute(points, bbox);
    // console.log( diagram.cells );
    diagram.cells.forEach(function(cell){
        // g.disc( cell.site, 2 );
    });


    diagram.edges.forEach(function(e){
        ctx.globalAlpha = .25;
        ctx.beginPath();
        ctx.moveTo(e.va.x, e.va.y);
        ctx.lineTo(e.vb.x, e.vb.y);
        ctx.stroke();

        // if( e.lSite !== null ){
        //     drawTri( ctx, e.lSite, e.va, e.vb );
        // }
        // if( e.rSite !== null ){
        //     drawTri( ctx, e.rSite, e.va, e.vb );
        // }
        // g.disc( cell.site, 2 );
    });


    ctx.restore();

    function drawTri( ctx, a, b, c ){


        ctx.beginPath();
        ctx.moveTo( a.x, a.y );
        ctx.lineTo( b.x, b.y );
        ctx.lineTo( c.x, c.y );
        ctx.lineTo( a.x, a.y );
        // ctx.stroke();

        // var cx0 = lerp( .25,a.x, b.x);
        // var cy0 = lerp( .25,a.y, b.y);
        // var cx00 = lerp( .75,a.x, b.x);
        // var cy00 = lerp( .75,a.y, b.y);
        //
        // var cx1 = lerp( .25,b.x, c.x);
        // var cy1 = lerp( .25,b.y, c.y);
        // var cx10 = lerp( .75,b.x, c.x);
        // var cy10 = lerp( .75,b.y, c.y);
        //
        // var cx2 = lerp( .25,c.x, a.x);
        // var cy2 = lerp( .25,c.y, a.y);
        // var cx20 = lerp( .75,c.x, a.x);
        // var cy20 = lerp( .75,c.y, a.y);
        //
        // ctx.moveTo( cx00, cy00 );
        // ctx.lineTo( cx1, cy1 );
        //
        // ctx.moveTo( cx10, cy10 );
        // ctx.lineTo( cx2, cy2 );
        //
        // ctx.moveTo( cx20, cy20 );
        // ctx.lineTo( cx0, cy0 );

    }

};