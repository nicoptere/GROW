
var dl = document.createElement( 'a' );
function save( ctx, id, cb ){

    ctx.canvas.toBlob(function(blob) {
        // dl.href = ctx.canvas.toDataURL('image/png');

        dl.href = URL.createObjectURL(blob);
        dl.download = id + ".png";
        dl.click();

        id++;
        if( cb )setTimeout( cb, 1, id );
    });

}