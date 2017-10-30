//radians
var RAD = Math.PI / 180;
function reset() {

    //stores some vairables
    points = [];
    angles = [];
    speeds = [];
    for (var i = 0; i < 100; i++) {
        //random point position on the screen
        points.push(new Point( Math.random() * w, Math.random() * h ) );
        //starting angle
        angles.push(Math.random() * Math.PI * 2);
        //rotation speed
        speeds.push(5 + Math.random() * 25);
    }
    iterations = 0;
}

function update(){

    requestAnimationFrame(update);

    //increase the iterations count
    if( iterations >= 100 )return;
    iterations++;

    for( var i = 0; i < points.length; i++ ){
        
        //draw a dot at the current position
        var p = points[i];
        circle( p.x, p.y, 2 );
        
        //move to current position
        ctx.beginPath();
        ctx.moveTo( p.x, p.y );

        //updates angle
        angles[i] += ( Math.random() - .5 ) * RAD * speeds[i];

        //updates poistion width the angle
        p.x += Math.cos( angles[i] ) * 30;
        p.y += Math.sin( angles[i] ) * 30;

        ctx.lineTo( p.x, p.y );
        ctx.stroke();

    }
}

var canvas, w, h, ctx, points, angles, speeds, iterations;
window.onload = function(){
    canvas = document.createElement( 'canvas' );
    document.body.appendChild( canvas );
    w = canvas.width = window.innerWidth ;
    h = canvas.height = window.innerHeight ;
    ctx = canvas.getContext("2d");
    window.addEventListener("mousedown", reset, false);
    reset();
    update();

};

var Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
};

function circle( x, y, r ){
    ctx.beginPath();
    ctx.arc( x,y,r, 0, Math.PI*2);
    ctx.fill();
}