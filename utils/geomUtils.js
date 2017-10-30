var geomUtils = function(exports) {

    var ip = new Point();
    var PI = Math.PI;
    var halfPi = PI / 2;

    /**
     * returns the angle between p0 and p1
     * @param    p0
     * @param    p1
     * @return
     */
    exports.angle = function(p0, p1) {
        return Math.atan2(p1.y - p0.y, p1.x - p0.x);
    };

    /**
     * returns the slope between p0 and p1
     * @param    p0
     * @param    p1
     * @return
     */
    exports.slope = function(p0, p1) {
        return ( p1.y - p0.y ) / ( p1.x - p0.x );
    };

    /**
     * returns the distance between p0 & p1
     * @param    p0
     * @param    p1
     * @return
     */
    exports.distance = function(p0, p1) {
        return Math.sqrt(exports.squareDistance(p0.x, p0.y, p1.x, p1.y));
    };

    /**
     * returns the square distance between 2 sets of x / y values
     * @param    x0
     * @param    y0
     * @param    x1
     * @param    y1
     * @return
     */
    exports.squareDistance = function(x0, y0, x1, y1) {
        return ( x0 - x1 ) * ( x0 - x1 ) + ( y0 - y1 ) * ( y0 - y1 );
    };

    /**
     * returns the value with a floating point the length of step
     * @param    value: number to round
     * @param    step : figures after the point. 10 - .1, 100-0.01 etc
     * @return
     */
    exports.toFixed = function(value, step) {
        step = step || 10;
        return Math.round(( value * step )) / step;
    };

    /**
     * reutrn the value number of times the step fits entirely into the value without returning a float
     * @param    value
     * @param    step
     * @return
     */
    exports.snap = function(value, step) {
        return Math.round(value / step) * step;
    };

    /**
     * clamps a value between 2 values min / max
     * @param    value
     * @param    min
     * @param    max
     * @return
     */
    exports.clamp = function(value, min, max) {
        return Math.max( min, Math.min( value, max ) );
    };

    /**
     * linear interpolation of T between A and B
     * @param    t
     * @param    a
     * @param    b
     * @return
     */
    exports.lerp = function(t, a, b) {
        return a * ( 1 - t ) + b * t;
    };

    /**
     * normalizes value between A and B
     * @param    value
     * @param    a
     * @param    b
     * @return
     */
    exports.normalize = function(value, a, b) {

        return (value - a) / (b - a);

    };

    /**
     * original exports.by Keith Paters: maps a value between 2 sets of values
     * @param    value
     * @param    min1
     * @param    max1
     * @param    min2
     * @param    max2
     * @return
     */
    exports.map = function(value, min1, max1, min2, max2) {
        return exports.lerp(exports.normalize(value, min1, max1), min2, max2);
    };

    /**************************************************************

     VECTOR UTILS

     **************************************************************/

    exports.determinant = function(p, a, b) {
        return ( ( a.x - b.x ) * ( p.y - b.y ) ) - ( ( p.x - b.x ) * ( a.y - b.y ) );
    };

    exports.isLeft = function(p, a, b) {
        return determinant(p, a, b) >= 0;
    };

    exports.isRightt = function(p, a, b) {
        return determinant(p, a, b) <= 0;
    };

    exports.normalizeVector = function(p) {
        var l = p.length();
        return new Point(p.x / l, p.y / l);
    };

    exports.normal = function(p0,p1) {
        return new Point(-(p1.y - p0.y), p1.x - p0.x ).normalize();
    };

    exports.dotProduct = function(u, v) {
        return ( u.x * v.x + u.y * v.y );
    };

    exports.crossProduct = function(u, v) {

        return ( u.x * v.y - u.y * v.x );

    };

    /** fast & furious projection method
     http://www.vcskicks.com/code-snippet/point-projection.php
     */
    exports.projectFast = function(p, a, b) {
        var m = ( b.y - a.y ) / ( b.x - a.x );
        var m2 = m * m;
        var i = a.y - ( m * a.x );
        return new Point(( m * p.y + p.x - m * i) / ( m2 + 1),
                         ( m2 * p.y + m * p.x + i) / ( m2 + 1));
    };

    /**
     * projects the point p on the line A-B
     * @param p
     * @param a
     * @param b
     * @param asSegment if set to true, contrains the intersection to the segment
     * @returns {*}
     */
    exports.project = function(p, a, b, asSegment) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        asSegment = Boolean( asSegment ) == true;
        if (asSegment && dx == 0 && dy == 0) {
            return a;
        }
        var t = ( ( p.x - a.x ) * dx + ( p.y - a.y ) * dy) / ( dx * dx + dy * dy );
        if (asSegment && ( t < 0 || t > 1 ) ) return exports.constrain( p, a, b );
        return new Point(a.x + t * dx, a.y + t * dy);
    };


    /**
     *  returns the reflection of p against the line A-B
     */
    exports.reflect = function(p,a,b) {
        var pp = exports.project(p,a,b,false);
        return new Point(   p.x + (pp.x - p.x) * 2,
                            p.y + (pp.y - p.y) * 2 );
    };

    /**
     *
     * @param p
     * @param a
     * @param b
     * @returns {*}
     */
    exports.constrain = function(p, a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        if (dx == 0 && dy == 0) {
            return a;
        }else {
            var t = ( (p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy);
            t = Math.min(Math.max(0, t), 1);
            return new Point(a.x + t * dx, a.y + t * dy);
        }
    };

    /*
     ---------------------------------------------------------------
     http://keith-hair.net/blog/

     Checks for intersection of Segment if as_seg is true.
     Checks for intersection of Line if as_seg is false.
     Return intersection of Segment AB and Segment EF as a Point
     Return null if there is no intersection

     ---------------------------------------------------------------
     */
    exports.lineIntersectLine = function(A, B, E, F, ABasSeg, EFasSeg ){

        var a1, a2, b1, b2, c1, c2;

        a1 = B.y - A.y;
        b1 = A.x - B.x;
        a2 = F.y - E.y;
        b2 = E.x - F.x;

        var denom = a1 * b2 - a2 * b1;
        if (denom == 0) {
            return null;
        }

        c1 = B.x * A.y - A.x * B.y;
        c2 = F.x * E.y - E.x * F.y;

        ip = new Point();
        ip.x = (b1 * c2 - b2 * c1) / denom;
        ip.y = (a2 * c1 - a1 * c2) / denom;

        if (A.x == B.x){
            ip.x = A.x;
        }
        else if (E.x == F.x){
            ip.x = E.x;
        }
        if (A.y == B.y){
            ip.y = A.y;
        }
        else if (E.y == F.y){
            ip.y = E.y;
        }

        if (ABasSeg) {
            if (( A.x < B.x ) ? ip.x < A.x || ip.x > B.x : ip.x > A.x || ip.x < B.x)
                return null;
            if (( A.y < B.y ) ? ip.y < A.y || ip.y > B.y : ip.y > A.y || ip.y < B.y)
                return null;
        }
        if (EFasSeg) {
            if (( E.x < F.x ) ? ip.x < E.x || ip.x > F.x : ip.x > E.x || ip.x < F.x)
                return null;
            if (( E.y < F.y ) ? ip.y < E.y || ip.y > F.y : ip.y > E.y || ip.y < F.y)
                return null;
        }
        return ip;

    };

    /**
     * checks if the ray from A to B intersects the line C-D
     * @param a
     * @param b
     * @param c
     * @param d
     * @returns {*}
     */
    exports.raySegmentIntersection = function(a,b,c,d, asSegment) {
        asSegment = Boolean( asSegment ) == true;
        var x1_ = a.x, y1_ = a.y, x2_ = b.x, y2_ = b.y, x3_ = c.x, y3_ = c.y, x4_ = d.x, y4_ = d.y;
        var p = null;
        var r, s, d1;
        if((y2_ - y1_) / (x2_ - x1_) != (y4_ - y3_) / (x4_ - x3_)) {
            d1 = (x2_ - x1_) * (y4_ - y3_) - (y2_ - y1_) * (x4_ - x3_);
            if(d1 != 0) {
                r = ((y1_ - y3_) * (x4_ - x3_) - (x1_ - x3_) * (y4_ - y3_)) / d1;
                s = ((y1_ - y3_) * (x2_ - x1_) - (x1_ - x3_) * (y2_ - y1_)) / d1;
                if(r >= 0) {
                    if( !asSegment || ( asSegment && s >= 0 && s <= 1 ) ) p = new Point(x1_ + r * (x2_ - x1_),y1_ + r * (y2_ - y1_));
                }
            }
        }
        return p;
    };

    /**
     * get the bounce vector
     */
    exports.bounceVector = function(p0,p1,l0,l1,PasSegment,LasSegment) {

        LasSegment = Boolean( LasSegment ) == true;
        PasSegment = Boolean( PasSegment ) == true;

        var ip = exports.lineIntersectLine(p0,p1,l0,l1,PasSegment,LasSegment);
        if( ip != null) {
            var normal = ip.clone().add( exports.normal(l0, l1 ).normalize() );
            var rp = exports.reflect( p0, ip, normal);
            return [ ip, rp ];
        }
        return null;
    };

    /**
     * returns a point at a position 't' along a path
     * @param points description of the path
     * @param t a value between 0 & 1
     * @returns {Point}
     */
    exports.getPositionAt = function( points, t ) {

        var length = points.length-1;
        var i0 = Math.floor( length * t );
        i0 = i0 < length - 1 ? i0 : length - 1;
        var i1 = Math.min( i0 + 1, length );

        var delta = 1 / length;
        var nt =  ( t - ( i0 * delta ) ) / delta;
        return p = new Point(
            exports.lerp( nt, points[i0].x, points[i1].x ),
            exports.lerp( nt, points[i0].y, points[i1].y )
        );
    };

    exports.vectorsHaveSameDirection = function( a,b,c,d ){
        var d0 = a.direction(b);
        var d1 = c.direction(d);
        return ( d0.dot( d1 ) > 0 );
    };

    /**
     * offset a polyline by a given amount
     */
    exports.offsetPolygon = function( points, offset ){
        var tmp = [];
        var count = points.length;
        for(var j = 0; j < count; j++){

            // finds the previous, current and next point
            var i = (j - 1);
            if (i < 0) i += count;
            var k = (j + 1) % count;

            var pre = points[ i ];
            var cur = points[ j ];
            var nex = points[ k ];

            //create 2 lines, parallel to both edges at a given distance 'offset'

            //computes a normal vector to the direction of the: prev -> current edge of length offset
            var l1 = exports.distance(cur, pre);
            var n1 = new Point(
                -( ( cur.y - pre.y ) / l1 ) * offset,
                ( ( cur.x - pre.x ) / l1 ) * offset
            );

            //does the same for the : current -> next edge
            var l2 = exports.distance(cur, nex);
            var n2 = new Point(
                -( ( nex.y - cur.y ) / l2 ) * offset,
                ( ( nex.x - cur.x ) / l2 ) * offset
            );

            //and create 2 points at both ends of the edge to obtain a parallel line
            var p1 = new Point( pre.x+n1.x, pre.y+n1.y );
            var p2 = new Point( cur.x+n1.x, cur.y+n1.y );
            var p3 = new Point( cur.x+n2.x, cur.y+n2.y );
            var p4 = new Point( nex.x+n2.x, nex.y+n2.y );

            // console.log( p1, p2, p3, p4 );
            var ip = exports.lineIntersectLine( p1, p2, p3, p4 );
            if( ip != null ) {
                tmp.push( ip );
            }

        }
        return tmp;
    }


    /******************************************************

     CIRCLE UTILITIES


     ******************************************************/

    /**
     * returns a true if the point is incside the circle, false otherwise
     * @param    p
     * @param    circle
     * @return
     */
    exports.circleContainsPoint = function (p, circle) {
        return exports.distance(circle, p) < circle.radius;
    };

    /**
     * returns a true if circle0 is incside circle1, false otherwise
     * @param    circle0
     * @param    circle1
     * @return
     */
    exports.circleContainsCircle = function (circle0, circle1) {
        var R = Math.max(circle0.radius, circle1.radius);
        var r = Math.min(circle0.radius, circle1.radius);

        return exports.distance(circle0, circle1) < ( R - r );
    };

    /**
     * returns the closest point to P on the circle circle
     * @param    p
     * @param    circle
     * @return
     */
    exports.closestPointOnCircle = function (p, circle) {
        var angle = exports.angle(circle, p);
        return exports.setPointAtAngle(angle, circle);
    };

    /**
     * places a point at a given angle on the circle
     * @param    angle
     * @param    circle
     * @return
     */
    exports.setPointAtAngle = function (angle, circle) {

        return new Point(circle.x + Math.cos(angle) * circle.radius,
            circle.y + Math.sin(angle) * circle.radius);

    };

    /**
     * returns the distance between 2 circles
     * @param    circle0
     * @param    circle1
     * @return
     */
    exports.circlesDistance = function (circle0, circle1) {

        return exports.distance(circle0, circle1) - ( circle0.radius + circle1.radius );

    };

    /**
     * returns the two end points of the distance segment between 2 circles
     * @param    circle0
     * @param    circle1
     * @return
     */
    exports.circlesDistanceSegment = function (circle0, circle1) {

        var p0, p1;
        if( exports.circleContainsPoint(circle0, circle1)){

            var angle = exports.angle(circle0, circle1) + PI;
            p0 = exports.setPointAtAngle(angle, circle0);
            p1 = exports.setPointAtAngle(angle, circle1);
        }else{
            p0 = exports.closestPointOnCircle( circle1, circle0 );
            p1 = exports.closestPointOnCircle( circle0, circle1 );
        }
        return  [p0, p1];

    };

    // http://htmlcoderhelper.com/find-a-tangent-point-on-circle/
    /**
     * returns 0, 1 or 2 points of tangency of a given point P onto the circle
     * @param    p
     * @param    circle
     * @return
     */
    exports.tangentsToPoint = function (p, circle) {

        var angle = exports.angle(circle, p);
        var distance = exports.distance(circle, p);

        if (distance < circle.radius) {
            return null;
        }
        else if (distance == circle.radius) {
            return [new Point(circle.x + Math.cos(angle) * distance, circle.y + Math.sin(angle) * distance)];
        }
        else {

            var alpha = angle + halfPi - Math.asin(circle.radius / distance);
            var beta = angle - halfPi + Math.asin(circle.radius / distance);

            return [new Point(circle.x + Math.cos(alpha) * circle.radius,
                circle.y + Math.sin(alpha) * circle.radius),

                new Point(circle.x + Math.cos(beta) * circle.radius,
                    circle.y + Math.sin(beta) * circle.radius)];

        }
        return null;
    };

    //http://mathworld.wolfram.com/Circle-CircleTangents.html
    //http://mathworld.wolfram.com/EyeballTheorem.html
    /**
     * return 2 sets of 2 points located on the tangency points of the circle0 onto circle1.
     * @param    circle0
     * @param    circle1
     * @return
     */
    exports.tangentsToCircle = function (circle0, circle1) {

        var R = Math.max(circle0.radius, circle1.radius);
        var r = Math.min(circle0.radius, circle1.radius);

        var p0, p1;
        var alpha, beta;

        if (R == r) //circles have same size: tangents are parallel
        {

            p0 = circle0;
            p1 = circle1;
            alpha = beta = exports.angle(p0, p1);
            alpha -= halfPi;
            beta += halfPi;

        }
        else {
            var dr = ( R - r );

            p0 = R == circle0.radius ? circle0 : circle1;
            p1 = r == circle0.radius ? circle0 : circle1;

            var c = new Point(p0.x, p0.y);
            c.radius = dr;

            var projection = exports.tangentsToPoint(p1, c);

            if (projection == null) return null;

            alpha = exports.angle(c, projection[0]);
            beta = exports.angle(c, projection[1]);

        }

        return [new Point(p0.x + Math.cos(alpha) * R, p0.y + Math.sin(alpha) * R),

            new Point(p1.x + Math.cos(alpha) * r, p1.y + Math.sin(alpha) * r),

            new Point(p0.x + Math.cos(beta) * R, p0.y + Math.sin(beta) * R),

            new Point(p1.x + Math.cos(beta) * r, p1.y + Math.sin(beta) * r)];


    };

    /**
     * return a vector tangent to a point
     * @param    p
     * @param    circle
     * @return
     */
    exports.tangentVector = function (p, circle) {
        var a = exports.angle(circle, p) + PI / 2;
        return new Point( Math.cos( a ), Math.sin( a ) );
    };

    /**
     * return two point tangent points spaced by length
     * @param p
     * @param circle
     * @param length
     * @returns {*[]}
     */
    exports.tangentSegment = function (p, circle, length) {
        var tv = exports.tangentVector( p, circle ).multiplyScalar( (length||100) * .5 );
        return [tv.clone().add( p ),tv.negate().add( p )];
    };

    //http://mathworld.wolfram.com/Circle-CircleIntersection.html
    /**
     * return the chord of the circle-circle intersection between circle0 and circle1
     * @param    circle0
     * @param    circle1
     * @return
     */
    exports.circlesIntersection = function (circle0, circle1) {

        var R = circle0.radius;
        var r = circle1.radius;
        var d = exports.distance(circle0, circle1);

        if (d > ( R + r )) return null;

        var baseRadius = ( ( d * d ) - ( r * r ) + ( R * R ) ) / ( 2 * d );

        var radius = 1 / d * Math.sqrt(( -d + r - R ) * ( -d - r + R ) * ( -d + r + R ) * ( d + r + R )) * .5;

        if (radius <= 0) return null;

        var angle = exports.angle(circle0, circle1);

        return [new Point(circle0.x + Math.cos(angle) * baseRadius + Math.cos(angle + halfPi) * radius,
            circle0.y + Math.sin(angle) * baseRadius + Math.sin(angle + halfPi) * radius),

            new Point(circle0.x + Math.cos(angle) * baseRadius + Math.cos(angle - halfPi) * radius,
                circle0.y + Math.sin(angle) * baseRadius + Math.sin(angle - halfPi) * radius)];

        return null;
    };

    //http://mathworld.wolfram.com/Circle-LineIntersection.html
    /**
     * returns 0, 1 or 2 points of intersection between the line defined by startPoint/endPoint and the circle
     * @param    startPoint
     * @param    endPoint
     * @param    circle
     * @return
     */
    exports.lineCircleIntersection = function (startPoint, endPoint, circle, asRay) {

        asRay = Boolean( asRay ) == true;
        var p0 = startPoint.clone().sub( circle );
        var p1 = endPoint.clone().sub( circle );

        var r = circle.radius;
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;

        var dr = Math.sqrt(dx * dx + dy * dy);
        var dr2 = dr * dr;
        var D = ( p0.x * p1.y ) - ( p1.x * p0.y );
        var discriminant = ( r * r ) * dr2 - ( D * D );

        if (discriminant < 0) return null;

        var sqrtDiscriminant = Math.sqrt(discriminant);

        var x = (  D * dy + ( ( dy < 0 ) ? -1 : 1 ) * dx * sqrtDiscriminant ) / dr2;
        var y = ( -D * dx + ( ( dy < 0 ) ? -dy : dy ) * sqrtDiscriminant ) / dr2;

        var ips = [new Point(x + circle.x, y + circle.y)];

        if (discriminant == 0) return ips;

        if (discriminant > 0) {
            x = (  D * dy - ( ( dy < 0 ) ? -1 : 1 ) * dx * sqrtDiscriminant ) / dr2;
            y = ( -D * dx - ( ( dy < 0 ) ? -dy : dy ) * sqrtDiscriminant ) / dr2;
            ips.push(new Point(x + circle.x, y + circle.y));
        }

        return ips;
    };


    exports.rayCircleIntersection = function(p0,p1,circle) {
        var d = p1.clone().sub( p0 ).normalize();
        var m = p0.clone().sub( circle );
        var b = m.dot( d );
        var c = m.dot( m ) - circle.radius * circle.radius;
        // Exit if r’s origin outside s (c > 0) and r pointing away from s (b > 0)
        if (c > 0 && b > 0 ) return null;
        var discr = b * b - c;
        // A negative discriminant corresponds to ray missing sphere
        if (discr < 0 ) return null;
        // Ray now found to intersect sphere, compute smallest t value of intersection
        var t = -b - Math.sqrt(discr);
        // If t is negative, ray started inside sphere so clamp t to zero
        if (t < 0 ) return null;
        return p0.clone().add( d.multiplyScalar(t) );
    };

    //http://www.experts-exchange.com/Programming/Game/AI_Physics/Q_24977935.html
    /**
     * returns 0, 1 or 2 points of intersection between the segment defined by startPoint/endPoint and the circle
     * @param    startPoint
     * @param    endPoint
     * @param    circle
     * @return
     */
    exports.segmentCircleIntersection = function (startPoint, endPoint, circle) {

        var ips = [];
        var a, b, c, bb4ac;

        var dp = new Point(endPoint.x - startPoint.x, endPoint.y - startPoint.y);

        a = dp.x * dp.x + dp.y * dp.y;
        b = 2 * (dp.x * (startPoint.x - circle.x) + dp.y * (startPoint.y - circle.y));
        c = circle.x * circle.x + circle.y * circle.y;
        c += startPoint.x * startPoint.x + startPoint.y * startPoint.y;
        c -= 2 * (circle.x * startPoint.x + circle.y * startPoint.y);
        c -= circle.radius * circle.radius;

        bb4ac = b * b - 4 * a * c;

        if (( ( a < 0 ) ? -a : a ) < Number.MIN_VALUE || bb4ac < 0) return null;

        var mu1, mu2;
        mu1 = (-b + Math.sqrt(bb4ac)) / (2 * a);
        mu2 = (-b - Math.sqrt(bb4ac)) / (2 * a);

        if ((mu1 < 0 || mu1 > 1) && (mu2 < 0 || mu2 > 1)) return null;

        var p1 = new Point(startPoint.x + ((endPoint.x - startPoint.x ) * mu1), startPoint.y + ((endPoint.y - startPoint.y) * mu1));
        var p2 = new Point(startPoint.x + ((endPoint.x - startPoint.x ) * mu2), startPoint.y + ((endPoint.y - startPoint.y) * mu2));

        if (mu1 > 0 && mu1 < 1 && (mu2 < 0 || mu2 > 1)) {
            ips.push(p1);
            return ips;
        }
        if (mu2 > 0 && mu2 < 1 && (mu1 < 0 || mu1 > 1)) {
            ips.push(p2);
            return ips;
        }
        if (mu1 > 0 && mu1 < 1 && mu2 > 0 && mu2 < 1) {
            if (mu1 == mu2) {
                ips.push(p1);
            }
            else {
                ips.push(p1, p2);
            }
            return ips;
        }

        return null;
    };

    /**
     * return the bounce vectors of a ray
     * @param s
     * @param e
     * @param circle
     * @param asSegment
     * @returns {Array}
     */
    exports.circleBounceVectors = function( s, e, circle, asSegment ){
        var ips = geomUtils.lineCircleIntersection( s, e, circle, asSegment );
        if( ips != null ){

            var tmp = [];
            ips.forEach( function(p){

                var tv = geomUtils.tangentVector( p, circle ).add( p );
                tmp.push( geomUtils.bounceVector(s, p, p, tv ) );
                tmp.push( geomUtils.bounceVector(e, p, p, tv ) );

            });
            return tmp;
        }
        return null;
    };

    //http://mathworld.wolfram.com/HomotheticCenter.html
    /**
     * return the homothetic centers of 2 circles
     * @param    circle0
     * @param    circle1
     * @return
     */
    exports.homotheticCenters = function (circle0, circle1) {

        var p0 = circle0.clone();
        var p1 = circle1.clone();

        p0.x += circle0.radius;
        p1.x += circle1.radius;
        var externalCenter = exports.lineIntersectLine(circle0, circle1, p0, p1, false, false);

        p0.x -= circle0.radius * 2;
        var internalCenter = exports.lineIntersectLine(circle0, circle1, p0, p1, false, false);

        if (internalCenter == null || externalCenter == null) return null;
        return [internalCenter, externalCenter];

    };

    //http://mathworld.wolfram.com/RadicalLine.html
    /**
     * computes the radical line of 2 circles, length is for decoration purpose
     * @param    circle0
     * @param    circle1
     * @param    length
     * @return
     */
    exports.radicalLine = function (circle0, circle1, length) {
        var r0 = circle0.radius;
        var r1 = circle1.radius;
        var d = exports.distance(circle0, circle1);
        var angle = exports.angle(circle0, circle1);

        var d0 = ( ( d * d ) + ( r0 * r0 ) - ( r1 * r1 ) ) / ( d * 2 );

        if (length < 0) length = d0;

        var p = new Point(circle0.x + Math.cos(angle) * d0,
            circle0.y + Math.sin(angle) * d0);
        return [
            new Point(p.x + Math.cos(angle + Math.PI / 2) * length,
                p.y + Math.sin(angle + Math.PI / 2) * length),
            new Point(p.x + Math.cos(angle - Math.PI / 2) * length,
                p.y + Math.sin(angle - Math.PI / 2) * length)
        ];
    };

    //http://mathworld.wolfram.com/RadicalCenter.html
    /**
     * returns the radical center ; the intersection point of 2 of the radical lines
     * @param    circle0
     * @param    circle1
     * @param    circle2
     * @return
     */
    exports.radicalCenter = function (circle0, circle1, circle2) {

        var rl0 = radicalLine(circle0, circle1);
        var rl1 = radicalLine(circle0, circle2);
        return exports.lineIntersectLine(rl0[0], rl0[1], rl1[0], rl1[1], false, false);

    };

    //http://mathworld.wolfram.com/Inversion.html
    /**
     * find the inverse point of a point onto the circle
     * @param    p
     * @param    circle
     * @return
     */
    exports.inversionPoint = function (p, circle) {

        var angle = exports.angle(circle, p);
        var distance = exports.distance(circle, p);

        if (distance < circle.radius) {
            return null;
        }
        else if (distance == circle.radius) {
            return new Point(circle.x + Math.cos(angle) * distance, circle.y + Math.sin(angle) * distance);
        }
        else {

            var alpha = angle + halfPi - Math.asin(circle.radius / distance);

            var q = new Point(circle.x + Math.cos(alpha) * circle.radius,
                circle.y + Math.sin(alpha) * circle.radius);

            return exports.project(q, circle, p);

        }
    };

    //http://mathworld.wolfram.com/Polar.html
    /**
     * returns the 2 anchors of the pole line from a given point onto a circle. length is for decoration purpose
     * @param    p
     * @param    circle
     * @param    length
     * @return
     */
    exports.poleFromPoint = function (p, circle, length) {

        var angle = exports.angle(circle, p);
        var d = exports.distance(circle, p);
        var p = new Point(circle.x + Math.cos(angle) * d,
            circle.y + Math.sin(angle) * d);
        return [
            new Point(p.x + Math.cos(angle + Math.PI / 2) * length,
                p.y + Math.sin(angle + Math.PI / 2) * length),
            new Point(p.x + Math.cos(angle - Math.PI / 2) * length,
                p.y + Math.sin(angle - Math.PI / 2) * length)
        ];

    };

    //http://mathworld.wolfram.com/Polar.html
    /**
     * returns the inverse point of the orthoProjection of the center of the circle onto the pole
     * @param    p0
     * @param    p1
     * @param    circle
     * @return
     */
    exports.inversionPointFromPole = function (p0, p1, circle) {

        var ip = exports.project(circle, p0, p1);
        if (circleContainsPoint(ip, circle))return ip;
        return inversionPoint(ip, circle);

    };

    exports.polygonContains = function( p, polygon ){
        var x = p.x;
        var y = p.y;
        var c = false,
            l = polygon.length,
            j = l - 1;

        for( var i = -1; ++i < l; j = i)
        {
            (   ( polygon[ i ].y <= y && y < polygon[ j ].y )
                ||  ( polygon[ j ].y <= y && y < polygon[ i ].y ) )
            &&  ( x < ( polygon[ j ].x - polygon[ i ].x ) * ( y - polygon[ i ].y ) / ( polygon[ j ].y - polygon[ i ].y ) + polygon[ i ].x )
            &&  ( c = !c);
        }
        return c;
    };

    exports.rotateAroundPoint = function( p, lattice, angle) {

        var a = exports.angle(lattice, p) + angle;
        var d = exports.distance(lattice, p);

        var pp = new Point();
        pp.x = lattice.x + Math.cos(a) * d;
        pp.y = lattice.y + Math.sin(a) * d;
        return pp;

    };

    return exports;
}({});