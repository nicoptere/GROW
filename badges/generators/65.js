
generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();

    var line = [];
    for( var i = 0; i < s; i+=2 ){
        line.push( new Point(i,0,0 ) );
    }

    // ctx.fillStyle = "#EEE";
    // g.disc(s/2, s/2 , s/3 );

    ctx.fillStyle = "#000";
    ctx.globalAlpha = .5;
    var sca = 0.005 / unit;
    for( i = s/2.75; i < s-s/3.5; i += 50 * unit ){

        ctx.beginPath();
        ctx.moveTo( s,s );
        ctx.lineTo( 0,s );

        line.forEach( function( p ){
            p.y = i;
            ctx.lineTo( p.x, i + PRNG.FBM( p.x * sca, p.y * sca, 5 ) * 25 * unit );
        } );

        ctx.lineTo( s,s );

        ctx.fill();


    }

    ctx.restore();

};