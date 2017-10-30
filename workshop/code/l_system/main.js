
//creates a canvas
var canvas = document.getElementById( 'canvas' );
// document.body.appendChild( canvas );
var w = canvas.width = window.innerWidth ;
var h = canvas.height = window.innerHeight ;
var ctx = canvas.getContext("2d");

//creates a system
var system = new Lsystem();
// system.compute( 4 );
// system.render( ctx );


var params = document.getElementById( "params" );
params.addEventListener( "keyup", updateSettings );
params.addEventListener( "mouseup", updateSettings );
function updateSettings(){


    system.length   = document.getElementById( "length" ).value;
    system.angle    = document.getElementById( "angle" ).value * ( Math.PI / 180 );
    system.axiom    = document.getElementById( "axiom" ).value;
    system.rule     = document.getElementById( "rule" ).value;
    system.production = "";

    ctx.clearRect( 0, 0, w,h );

    var generations = document.getElementById( "generations" ).value;
    system.compute( generations );
    system.render( ctx );
    document.getElementById( "production" ).value = system.production;

}

window.addEventListener("message", receiveMessage, false);
function receiveMessage(event){
    if( event.data == "slide:start" ){
        updateSettings();
    }
    if( event.data == "slide:stop" ){
        ctx.clearRect( 0, 0, w,h );
    }
}
window.onload = function(){
    updateSettings();
};
