function project(p, a, b, asSegment) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    if (asSegment && dx == 0 && dy == 0) {
        return a;
    }
    var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );
    if (asSegment && t < 0) return a;
    if (asSegment && t > 1) return b;
    return new Point(a.x + t * dx, a.y + t * dy);
}

function reflect(p, a, b) {
    var pp = project(p, a, b);
    return new Point(p.x + ( pp.x - p.x ) * 2, p.y + ( pp.y - p.y ) * 2);
}

function reset() {

    ctx.restore();
    ctx.clearRect(0, 0, w, h);

    var radius = h/3;
    var step = Math.PI * 2 / 64;
    var center = new Point(w/2, h/2);
    var points = [];

    //distributes points on a quarter of a circle
    for (var i = 0; i < Math.PI / 2 + step; i += step ) {
        var p = new Point(
            center.x + Math.cos( i ) * radius,
            center.y + Math.sin( i ) * radius
        );
        points.push(p.clone());
        circle(p.x, p.y, 2);
        circle(p.x, p.y, 5);
    }
    renderLine(points);

    //vertical symmetry
    var start   = new Point( 0, h/2 );
    var end     = new Point( w, h/2 );
    points.forEach(function (p) {
        var tmp = reflect( p, start, end);
        line(p, tmp);
        circle(tmp.x, tmp.y, 2);
    });
    line(start, end);

    //horizontal symmetry
    start   = new Point( w/2, 0 );
    end     = new Point( w/2, h );
    points.forEach(function (p) {
        var tmp = reflect( p, start, end);
        line(p, tmp);
        circle(tmp.x, tmp.y, 2);
    });
    line(start, end);

    //diagonal symmetry
    start   = new Point( w/2-radius, h/2+radius );
    end     = new Point( w/2+radius, h/2-radius );
    points.forEach(function (p) {
        var tmp = reflect( p, start, end);
        line(p, tmp);
        circle(tmp.x, tmp.y, 2);
    });
    line(start, end);
}


//creates a 2D context
var canvas, w, h, ctx;
window.onload = function () {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    ctx = canvas.getContext("2d");
    reset();
};

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
}
function line(a, b) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
}
function renderLine(points) {
    ctx.beginPath();
    points.forEach(function (p) {
        ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
}
function drawGrid(w, h, cellSize) {

    ctx.save();
    //draws the grid
    ctx.globalAlpha = .25;
    ctx.beginPath();
    for (i = 0; i <= w; i += cellSize) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
    }
    for (j = 0; j <= h; j += cellSize) {
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
    }
    ctx.stroke();
    ctx.restore();

}