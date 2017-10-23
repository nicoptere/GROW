
generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();

    var count = 30;
    var cell = s / count;
    var a = PRNG.random() * PI2;
    for ( var i = 0; i < s; i+=cell ){
        for ( var j = 0; j< s; j+=cell ){
            ctx.globalAlpha = 1- Math.abs( PRNG.FBM( i/s, j/s, 2 ) * 2 );
            ctx.beginPath();
            splitQuad( i, j, cell, Math.abs( PRNG.FBM( i/s, j/s, 3 ) * 2 )  );
            ctx.stroke();
        }
    }



    function splitQuad( x, y, c, t ){

        var cx = x + c * .5;
        var cy = y + c * .5;

        var axis_v = [new Point( cx, y), new Point( cx, y+c ) ];

        var axis_h = [new Point( x, cy ), new Point( x+c, cy ) ];

        var lattice =  new Point( cx, y );
        var p0 = new Point( 0, 0 );
        var p1 = new Point( c / 2 * t, 0 );
        var p2 = new Point( c / 2 * .5, c/4 );
        var p3 = new Point( c / 2 * ( 1-t ), c/2 );
        var p4 = new Point( c / 2, c/2 );


        var line = [p0, p1, p2, p3, p4 ];
        line.forEach(function(p){p.add(lattice );});
        symmetries( line, axis_h, axis_v );

        var pivot = new Point( cx+c/4, cy+c/4 );
        line.forEach(function(p){
            p.copy( geomUtils.rotateAroundPoint( p, pivot, PI / 2 ) );
        });
        symmetries( line, axis_h, axis_v );

    }

    function symmetries( line, h, v ){

        render(line);
        line.forEach(function(p){
            p.copy( geomUtils.reflect( p, h[0], h[1] ) );
        });
        render(line);
        line.forEach(function(p){
            p.copy( geomUtils.reflect( p, v[0], v[1] ) );
        });
        render(line);
        line.forEach(function(p){
            p.copy( geomUtils.reflect( p, h[0], h[1] ) );
        });
        render(line);

    }

    function render( l ){
        ctx.moveTo(l[0].x,l[0].y);
        l.forEach( function( p ){
            ctx.lineTo( p.x, p.y );
        });
    }

};
