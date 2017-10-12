generators[ genId++ ] = function(g, ctx, s, seed, unit) {

    var Tri = {

        build: function ( a,b,c) {
            return [a,b,c];
        },

        split: function (tri, r0, r1 ) {

            var p0 = tri[0].pointAt(r0, tri[1]);
            var p1 = tri[0].pointAt(r0, tri[2]);
            var p = p0.pointAt( r1, p1 );

            return [

                Tri.build( tri[0], p, tri[1] ),
                Tri.build( tri[1], p, tri[2] ),
                Tri.build( tri[2], p, tri[0] )

            ];
        },

        draw: function (ctx, tri) {
            ctx.beginPath();
            ctx.moveTo(tri[0].x, tri[0].y);
            ctx.lineTo(tri[1].x, tri[1].y);
            ctx.lineTo(tri[2].x, tri[2].y);
            ctx.fill();
        }

    };
    PRNG.setSeed(seed || 0);

    var points= [];
    var tot = 10;
    var ang = -PI / 2;
    var step = PI * 2 / tot;
    var r = s * Math.sqrt( 2 ) * .5;

    ctx.save();
    ctx.shadowColor = "#000";
    ctx.translate(s/2,s/2);
    var cell = s / tot;

    ctx.shadowBlur = 50 * unit;
    for( var j = 0; j <= tot; j++ ){
        for( var i = 0; i <= tot; i++ ){

            // var a = new Point( Math.cos( ang ) * r, Math.sin( ang ) * r );
            var a = new Point( cell * i -s/2, cell * j -s/2);
            points.push( a );
        }

    }

    var ox = PRNG.random() * s;
    var oy = PRNG.random() * s;
    // points.sort( function( a,b ){return PRNG.random() > .5 ? - 1 : 1;});
    points.forEach( function(a){

        var sca = unit;
        var r = Math.min( 10, 1 + Math.abs( PRNG.FBM( ( ox + a.x ) * sca, ( oy + a.y ) * sca, 2 ) * Math.PI * 3 ) );
        ctx.fillStyle = "#FFF";
        g.disc( a, 20 * unit * r );

    });

    ctx.restore();
    ctx.drawImage( segment( ctx.canvas, s, 8), 0,0 );

    ctx.restore();


};

function segment( imageOrCanvas, s, steps )
{

    var canvas = document.createElement("canvas");
    canvas.width = s;
    canvas.height = s;

    var context = canvas.getContext("2d");
    context.fillStyle = "rgba(255,255,255,255)";
    context.fillRect(0, 0, s, s);
    context.drawImage(imageOrCanvas, 0, 0 );

    var imgData = context.getImageData(0, 0, s, s);
    var data = imgData.data;

    for( var i = 0; i < data.length; i += 4 )
    {
        data[i]     = parseInt(parseInt( ( data[i] / 0xFF ) * steps + .5 ) * ( 0xFF / steps ) );
        data[i + 1] = parseInt(parseInt( ( data[i + 1] / 0xFF ) * steps + .5 ) * ( 0xFF / steps ) );
        data[i + 2] = parseInt(parseInt( ( data[i + 2] / 0xFF ) * steps + .5 ) * ( 0xFF / steps ) );
    }

    imgData.data = data;
    context.putImageData( imgData, 0, 0 );
    return canvas;
}
// var img = document.getElementById( "me_gusta" );
// segment( img, 16 );
// segment( img, 8 );
// segment( img, 1 );