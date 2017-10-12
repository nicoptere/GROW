var D3 = function( exports){
    var projection;
    exports.focalDistance = 250;
    exports.project = function(v) {

        if( projection === undefined )projection = new Point();
        // Distance between the camera and the plane
        var d = exports.focalDistance || 200;
        var r = d / v.z;
        projection.x = r * v.x;
        projection.y = r * v.y;
        return projection;
    };

    exports.render = function(objects, ctx ) {

        ctx.restore();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height );

        ctx.save();
        ctx.translate( ctx.canvas.width / 2, ctx.canvas.height / 2 );

        // For each object
        var v = new Point(), P;
        for (var i = 0; i < objects.length; i++ ){

            var m = objects[i];
            var vs = m.vertices;
            // render Ngon
            ctx.beginPath();

            for ( var j = 0; j < m.indices.length; j+= m.indicesPerNGon ) {

                for (var k = 0; k < m.indicesPerNGon; k++ ) {

                    var index = m.indices[ j + k ];
                    v.copy( vs[ index ] ) .add( m.position );
                    P = exports.project( v );
                    if( k === 0 ) {
                        ctx.moveTo( P.x, -P.y );
                    }else{
                        ctx.lineTo( P.x, -P.y );
                    }

                }

            }

            ctx.closePath();
            // ctx.globalAlpha = 1;
            ctx.stroke();
            // ctx.globalAlpha = .25;
            // ctx.fill();

        }
    };

    // Rotate a vertice
    exports.getRotation = function(x,y) {

        var theta = (evt.clientX - mx) * Math.PI / 360;
        var phi = (evt.clientY - my) * Math.PI / 180;

        // for (var i = 0; i < 8; ++i)
        //     rotate(cube.vertices[i], cube_center, theta, phi);
    };

    exports.rotate = function( mesh, theta, phi ) {

        // Rotation matrix coefficients
        var ct = Math.cos(theta);
        var st = Math.sin(theta);
        var cp = Math.cos(phi);
        var sp = Math.sin(phi);

        // Rotation
        m.vertices.forEach( function( v ){
            var x = v.x - mesh.position.x;
            var y = v.y - mesh.position.y;
            var z = v.z - mesh.position.z;

            v.x = ct * x - st * cp * y + st * sp * z + mesh.position.x;
            v.y = st * x + ct * cp * y - ct * sp * z + mesh.position.y;
            v.z = sp * y + cp * z + mesh.position.z;
        });
    };

    return exports;

}({});