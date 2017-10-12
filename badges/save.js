
var dl = document.createElement( 'a' );
function save( ctx, seed, cb ){

    canvas.toBlob(function(blob) {
        // dl.href = ctx.canvas.toDataURL('image/png');

        dl.href = URL.createObjectURL(blob);
        dl.download = seed + ".png";
        dl.click();

        if( cb )setTimeout( cb, 1 );
    });

}