
generators[ genId++ ] = function( g, ctx, s, seed, unit ){

    PRNG.setSeed( seed || 0 );

    var turns = 10;
    var total = Math.PI * 2  * turns;
    var minRadius = s / 5;
    var maxRadius = minRadius + s/5;
    var ga = ( ( 1 + Math.sqrt(5) ) / 2 ) / 5;

    var i=0;
    ctx.save();
    ctx.translate( s/2,s/2 );
    ctx.lineJoin = "round";
    var sca = .0005 / unit;
    for ( var angle = 0; angle <= total; angle+=ga ){

        var radius = map( angle, 0, total, minRadius, maxRadius );
        var x = Math.cos( angle ) * radius * .75;
        var y = Math.sin( angle ) * radius;

        g.disc( x,y, 2 * unit );
        ctx.moveTo(x,y);
        var ang = ( PRNG.FBM( x * sca, y * sca ) * Math.PI * 4 );

        x += Math.cos( ang ) * radius * .25;
        y += Math.sin( ang ) * radius * .25;
        ctx.lineTo(x,y);
        ctx.stroke();

    }
    ctx.restore();

    return PORTRAIT;
}