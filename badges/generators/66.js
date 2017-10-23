generators[genId++] = function (g, ctx, s, seed, unit) {

    PRNG.setSeed(seed || 0);
    noise.seed(PRNG.random());

    ctx.save();

    ctx.translate(s / 2, s / 2);
    var c = new Point(0, 0, s / 3);
    c.radius = s / 2.5;

    var bubbles = [];
    for (var i = 0; i < 100; i++) {
        var a = PRNG.random() * PI2;
        var ir = 5 * unit + PRNG.random() * 5 * unit;
        var r = ( Math.sqrt(PRNG.random()) ) * s / 3 - ir;
        var p = pointAtAngleRadius(a, r);
        p.r = ir;
        bubbles.push(p);

    }

    var step = PI2 / ( c.radius * 2 );

    var sca = 0.001 / unit;

    var st = new Point();
    var en = new Point();

    var bounds = [];
    for (i = -c.radius; i < c.radius; i++) {
        a = i * step;
        var l = new Point(i, Math.sin(a) * 100 * unit).multiplyScalar(sca);
        l.y = PRNG.FBM(l.x, l.y, 2) * 100;
        l.x = i;
        l.r = 10 * unit;
        if (i === -c.radius) st = l.clone();
        if (~~( i ) === ~~( c.radius ) - 1) {
            en = l.clone();
        }

        if (!geomUtils.circleContainsPoint(l, c)) {
            l = geomUtils.closestPointOnCircle(l, c);
        }

        bubbles.forEach(function (p) {
            if (p.x < i && p.y + p.z > l.y) p.renderable = true;
        });
        bounds.push(l);

    }

    var as = getAngle(c, st);
    var ae = getAngle(c, en);
    var sta = Math.min(as, ae);
    var ena = Math.max(as, ae);

    for (a = sta; a < ena; a += RAD) {

        p = pointAtAngleRadius(a, c.radius);
        bounds.push(p);
        ctx.lineTo(p.x, p.y);

    }

    // ctx.shadowColor = "#FFF";
    // ctx.shadowBlur = 100 * unit;
    // ctx.shadowBlur = 100 * unit;
    ctx.filter = "blur( " + 30 * unit +"px )";

    g.polygon(bounds, true);
    ctx.filter = "blur( 0 )";
    // ctx.stroke()

    i = 10;
    while (i--) {
        repel(bubbles, bounds);
        repel(bubbles, bubbles);
    }

    var darks = [];
    var lights = [];

    bubbles.forEach(function (p) {
        p.radius = p.r;
        // if( !geomUtils.circleContainsCircle(p,c))return;
        if (geomUtils.polygonContains(p, bounds)) {
            darks.push(p);
        } else {
            lights.push(p);
        }
    });

    // ctx.fillStyle = "#FFF";
    g.circle(c, c.radius);
    ctx.save();
    ctx.clip();

    var voronoi = new Voronoi();
    var bbox = {xl: -s, xr: s, yt: -s, yb: s};
    ctx.strokeStyle = "#FFF";
    // var points = darks.map( function( p ){return [p.x, p.y ]; });
    // var delaunay = new Delaunator( points );
    // var tris = delaunay.triangles;
    // for( i = 0; i < tris.length; ){
    //     drawTri( ctx, points, tris[i++], tris[i++], tris[i++]);
    // }
    // var diagram = voronoi.compute(darks, bbox);
    // diagram.edges.forEach(renderCell);


    ctx.strokeStyle = "#000";
    var points = lights.map(function (p) {
        return [p.x, p.y];
    });
    var delaunay = new Delaunator(points);
    var tris = delaunay.triangles;
    for (i = 0; i < tris.length;) {
        drawTri(ctx, points, tris[i++], tris[i++], tris[i++]);
    }
    var diagram = voronoi.compute(lights, bbox);
    diagram.edges.forEach(renderCell);

    ctx.restore();

    bubbles.forEach(function (p) {
        p.radius = p.r;
        var r = .5;
        if (geomUtils.polygonContains(p, bounds)) {
            ctx.fillStyle = "#FFF";
        } else {
            ctx.fillStyle = "#000";
            r = .5
        }
        g.disc(p, p.r * r);
    });

    function drawTri(ctx, ps, a, b, c) {

        ctx.beginPath();
        ctx.globalAlpha = .25;
        ctx.moveTo(ps[a][0], ps[a][1]);
        ctx.lineTo(ps[b][0], ps[b][1]);
        ctx.lineTo(ps[c][0], ps[c][1]);
        ctx.lineTo(ps[a][0], ps[a][1]);
        ctx.stroke();
    }

    ctx.restore();

    function renderCell(e) {
        ctx.globalAlpha = .75;
        ctx.beginPath();
        ctx.moveTo(e.va.x, e.va.y);
        ctx.lineTo(e.vb.x, e.vb.y);
        ctx.stroke();
    }

    function repel(a, b) {

        var acc = 0;
        a.forEach(function (circle) {

            b.forEach(function (other) {

                if (circle === other) return;

                var p = circle;
                var o = other;

                var d = geomUtils.distance(p, o);
                var minDist = circle.r + other.r;

                if (d < minDist) {

                    var dir = p.direction(o);
                    dir.z = 0;
                    p.sub(dir);
                    o.add(dir);
                    acc += d;
                }

            });

        });
        return acc;
    }

};