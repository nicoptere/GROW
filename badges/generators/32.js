generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    PRNG.setSeed(seed);


    ctx.save();
    var alt = 0;

    var vs = s/40;
    var es = s/10;
    for( var k = vs; k  <= es; k *= 2 ){

        var tot = s / k;

        ctx.lineCap = "round";

        ctx.lineWidth = unit * 10 * ( 1 - k / es );
        ctx.globalAlpha = 1;// - ( 1 - k / es ) ;//1 - ( .15 * ( k / es ) );

        var v = ~~( ( k / es ) * 0xFF );
        var c = 'rgb('+v+','+v+','+v+')';
        ctx.strokeStyle = c;

        // ctx.shadowColor = "#000";
        // ctx.shadowBlur = 5 * unit;

        for( var i = 0; i <= tot; i++ ){
            for( var j = 0; j <= tot; j++ ){

                var a = new Point( k * i, k * j );

                ctx.beginPath();
                drawTile( a,k );

            }

        }


    }
    function drawTile( a, k ){

        var v = 0;
        var c = 1 + PRNG.random() >.5 ? 2 : 0;
        while( c-- ){

            var ran = PRNG.random();
            if( ran < .25 ){
                v |= 1;
            }else if( ran < .50 ){
                v |= 1 << 1;
            }else if( ran < .75 ){
                v |= 1 << 2;
            }else{
                v |= 1 << 3;
            }

        }

        if( v >> 0 & 1 ) g.arc(a.x, a.y, k / 2, 0, PI / 2, false);

        if( v >> 1 & 1 ) g.arc(a.x + k, a.y + k, k / 2, -PI / 2, -PI, false);

        if( v >> 2 & 1 ) g.arc( a.x+k,  a.y,    k/2, PI / 2, PI, false );

        if( v >> 3 & 1 ) g.arc( a.x,a.y+k,  k/2, -PI / 2, 0, false );

    };
    ctx.restore();
    return LANDSCAPE;

}