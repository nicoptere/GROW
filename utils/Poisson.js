
var Poisson = function( exports )
{

    var width, height, grid;

    function distribute( count, radius, w, h )
    {
        width = w;
        height = h;

        var cellSize = exports.cellSize = radius / Math.sqrt( 2 );
        exports.grid = grid = buildGrid( Math.ceil( w / cellSize), Math.ceil( h / cellSize) );
        count = Math.min( count, Math.floor( w / cellSize) * Math.floor( h / cellSize) )

        var processList = [];
        var firstPoint = new Point( w *.5, h *.5);
        processList.push(firstPoint);

        setGridPoint( imageToGrid(firstPoint, cellSize), firstPoint );

        var result = [];

        var total = count;
        while( result.length < count )
        {

            var added = false;
            var attempt = 10;

            while( !added ){

                var rid = ~~( PRNG.random() * processList.length );
                var point = processList[ rid ];
                var newPoint = generateRandomPointAround( point, radius );

                //check that the point is in the image region
                //and no points exists in the point's neighbourhood
                if( inRectangle(newPoint)
                    &&  !inNeighbourhood( grid, newPoint, radius, cellSize ) )
                {
                    processList.push(newPoint);
                    result.push(newPoint);
                    setGridPoint( imageToGrid( newPoint, cellSize ),  newPoint );
                    added = true;
                }
                if(attempt--<=0)break;
            }
            if(total--<=0)break;

        }
        return result;
    }

    function buildGrid( w, h )
    {
        var g = [];
        for( var i = 0; i < w; i++ )
        {
            var tmp = [];
            for( var j = 0; j < h; j++ )
            {
                tmp.push( null );
            }
            g.push( tmp );
        }
        return g;
    }

    function setGridPoint( gridPoint, value )
    {

        if( grid[ gridPoint.x ][ gridPoint.y ] != null )return;
        grid[ gridPoint.x ][ gridPoint.y ] = value;
    }

    function inRectangle( point )
    {
        return point.x > 0 && point.x < width && point.y > 0 && point.y < height;
    }

    function imageToGrid( point, cellSize)
    {
        var gridX = ~~( point.x / cellSize );
        var gridY = ~~( point.y / cellSize );
        return new Point(gridX, gridY);
    }

    function generateRandomPointAround( point, mindist )
    {
        var r1 = PRNG.random();
        var r2 = PRNG.random();
        var radius = mindist * ( r1 + 1);
        var angle = 2 * Math.PI * r2;
        var newX = point.x + radius * Math.cos(angle);
        var newY = point.y + radius * Math.sin(angle);
        return new Point(newX, newY);
    }

    function inNeighbourhood( grid, point, mindist, cellSize)
    {
        var gridPoint = imageToGrid( point, cellSize );

        var cellsAroundPoint = squareAroundPoint( grid, gridPoint.x, gridPoint.y, 4 );

        var valid = false;
        cellsAroundPoint.forEach( function( cell ){
            if( cell == null )return;

            var min_dist = mindist;

            //using a noise (or any non-uniform) function
            //var min_dist = mindist + simplex.simplex2( point.x * .01, point.y * .01 ) * mindist;

            if( distance( cell, point ) < min_dist ){

                valid = true;
            }
        });
        return valid;
    }

    function squareAroundPoint( grid, x, y, offset )
    {
        var off = Math.round( offset / 2 );
        var minX = Math.max( 0, Math.min( grid.length, x - off ) );
        var maxX = Math.max( 0, Math.min( grid.length, x + off ) );
        var minY = Math.max( 0, Math.min( grid[0].length, y - off ) );
        var maxY = Math.max( 0, Math.min( grid[0].length, y + off ) );
        var tmp = [];
        for( var i = minX; i < maxX; i++ )
        {
            for( var j = minY; j < maxY; j++ )
            {
                if( grid[ i ][ j ] != null )tmp.push( grid[ i ][ j ] );
            }
        }
        return tmp;
    }

    exports.distribute = distribute;
    return exports;
}( {} );
