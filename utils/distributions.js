var distribution = function(exports){

    exports.sphereUniform = function(howMany, radius) {
        var vectors = [];

        var inc = Math.PI * (3 - Math.sqrt(5));

        var x = 0;
        var y = 0;
        var z = 0;
        var r = 0;
        var phi = 0;

        for (var k = 0; k < howMany; k++) {
            var off = 2 / howMany;
            var vec3 = new Point();

            y = k * off - 1 + off / 2;
            r = Math.sqrt(1 - y * y);

            phi = k * inc;

            x = Math.cos(phi) * r;

            z = (0, Math.sin(phi) * r);

            x *= radius;
            y *= radius;
            z *= radius;

            vec3.x = x;
            vec3.y = y;
            vec3.z = z;

            vectors.push(vec3);
        }

        return vectors;
    };

    return exports;
}({});
