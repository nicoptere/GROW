generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);


    ctx.save();
    var alt = 0;
    for( var k = 50; k  <= 200 ; k *= 2 ){

        var tot = s / k;

        ctx.lineCap = "butt";

        ctx.lineWidth = 4 * unit;
        ctx.globalAlpha = .5 * ( k / 100 );

        ctx.shadowColor = "#000";
        ctx.shadowBlur = 5 * unit;

        for( var j = 0; j <= tot; j++ ){
            for( var i = 0; i <= tot; i++ ){

                var a = new Point( k * i, k * j );
                var ran = PRNG.random();

                ctx.beginPath();
                if( ran < .5 ){
                    g.arc( a.x,  a.y,    k/2, 0, PI / 2, false );
                    g.arc( a.x+k,a.y+k,  k/2, -PI / 2, -PI, false );

                }else{
                    g.arc( a.x+k,  a.y,    k/2, PI / 2, PI, false );
                    g.arc( a.x,a.y+k,  k/2, -PI / 2, 0, false );
                }
                ctx.strokeStyle = "#000";
                ctx.stroke();

            }

        }


    }
    ctx.restore();

}