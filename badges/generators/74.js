generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed( seed || 0 );
    noise.seed(PRNG.random());

    ctx.save();

    function pointLineDistance( p, a,b ){
        var pp = geomUtils.project(p, a,b, true );
        return getDistance( p, pp );
    }

    var points = Poisson.distribute( 100, s/25, s,s );

    var maxDist = Number.NEGATIVE_INFINITY;
    points.forEach(function(p,i){
        points.forEach(function(o,j){
            if( i === j )return;
            maxDist = Math.max( maxDist, getDistance(p,o) );
        });
        ctx.fillStyle = "#000";
        g.disc( p,  5 * unit );
        ctx.fillStyle = "#FFF";
        g.disc( p.x,p.y-2*unit, 2 * unit );
        ctx.fillStyle = "#000";
    });

    var count = 100;
    var cell = s / count;

    for( var i = 0; i < count; i++ ){
        for( var j = 0; j < count; j++ ){

            var minDist = Number.POSITIVE_INFINITY;

            var p = new Point( i * cell, j * cell  );
            //p.x += PRNG.random() * cell * .5;
            //p.y += PRNG.random() * cell * .5;

            points.forEach(function(o){
                minDist = Math.min( minDist, getDistance(p,o) );
            });
            if( minDist > maxDist * .1 )continue;

            var idw = Math.max( .1, Math.pow( 1 - minDist/maxDist, 16 ) );
            // ctx.globalAlpha = idw * 2;

            // g.disc( p,  idw * 10 * unit );
            var w = cell - idw * cell;//
            ctx.beginPath();
            ctx.rect( p.x, p.y, w, w  );
            ctx.fill();

        }
    }

    ctx.restore();
    return PORTRAIT;

};
