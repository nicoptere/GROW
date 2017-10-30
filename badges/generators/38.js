generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);

    var turns = 10;
    var total = Math.PI * 2  * turns;
    var minRadius = s/8;
    var maxRadius = minRadius + s/6;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;

    var i = 0;
    var points = [];

    ctx.save();
    ctx.translate( s/2,s/2 );

    for ( i = 0; i < 80; i++ ){
        var angle = ( PRNG.random() * Math.PI * 2 );
        var radius = s/2 * .62;
        var x = Math.cos( angle ) * radius;
        var y = Math.sin( angle ) * radius;
        points.push( new Point( x, y ) );
    }

    for ( i = 0; i < 20; i++ ){
        angle = ( PRNG.random() * Math.PI * 2 );
        radius = s/2.38;
        x = Math.cos( angle ) * radius;
        y = Math.sin( angle ) * radius;
        points.push( new Point( x, y ) );
    }

    ctx.strokeStyle = "#000";
    ctx.lineJoin = "round";
    ctx.lineWidth = unit;

    points.forEach( function( p,i ){
        ctx.globalAlpha = .01;
        points.forEach( function( o,j ){
            if( i === j )return ;
            g.line( p, o );
        });
    });
    ctx.restore();
    return PORTRAIT;

};