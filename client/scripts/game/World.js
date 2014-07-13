/* global lib */

/**
 * @class World
 * 
 * @brief Contains the map of the world and all objects therein.
 * 
 * Tiles within the world are organized by layer, row, then column or Z, Y, X. This arrangement is
 * intended to optimize tile access for layers (Z) and rows (Y). The origin tile (0,0,0) is at the
 * top, back, left of the world.
 * 
 * This is an example unit-world. The top layer is bounded by the points (0,0,0), (0,0,1), (0,1,1),
 * and (0,1,0) in clock-wise order from top-left. The floating point (1,0,1) is hidden in the back
 * of the world. Note that all these coordinates are in z, y, x, order.
 * @code
 *     0,0,0        0,0,1
 *       *--------------*
 *       |\              \
 *       | \              \
 *       |  \ 0,1,0        \
 *       |   *--------------* 0,1,1
 *       |   |              |
 * 1,0,0 *   |          *   |
 *        \  |        1,0,1 |
 *         \ |              |
 *          \|              |
 *           *--------------*
 *         1,1,0        1,1,1
 * @end_code
 * 
 * Even though the world stores everything in Z, Y, X order, all functions expect X, Y, Z order as
 * that is usually easier for people to understand.
 */
lib.register( 'World', [ 'noise' ], function( noise ){
  var TILE_TYPES = {
    GRASS : 0,
    BUSH  : 1,
    TREE  : 2
  };
  var TILE_TYPE_NAMES = Object.keys( TILE_TYPES );
  var TILE_TYPE_COUNT = TILE_TYPE_NAMES.length;
  var NOISE_SCALE     = 200;
  var Z_SCALE         = 75;
  var BIG_SCALE       = 1;
  var MEDIUM_SCALE    = 2;
  var SMALL_SCALE     = 3;
  var DENSITY_SCALE   = 512;
  var SOLID_POINT     = 50;

  // -------------------------------------------------------------------------------------------- //

  function World(){
    this.tiles        = undefined;
    this.objects      = {};
    this.controllers  = {};
  }
  var WorldPrototype = World.prototype;

  // -------------------------------------------------------------------------------------------- //

  World.TILE_TYPES      = TILE_TYPES;
  World.TILE_TYPE_NAMES = TILE_TYPE_NAMES;

  // -------------------------------------------------------------------------------------------- //

  var Tile = (function(){
    function Tile( typeId ){
      this.type = typeId;
    }

    return Tile;
  })();

  // -------------------------------------------------------------------------------------------- //

  WorldPrototype.generate = function( x, y, z ){
    this.width  = x = parseInt( x, 10 );
    this.height = y = parseInt( y, 10 );
    this.depth  = z = parseInt( z, 10 );

    // var large       = new noise.Simplex3D( 0.07103920564986765  );
    // var medium      = new noise.Simplex3D( 0.1194343869574368   );
    // var small       = new noise.Simplex3D( 0.3741140146739781   );
    var large       = new noise.Simplex3D( Math.random() );
    var medium      = new noise.Simplex3D( Math.random() );
    var small       = new noise.Simplex3D( Math.random() );
    var bigNoise    = NOISE_SCALE / BIG_SCALE;
    var mediumNoise = NOISE_SCALE / MEDIUM_SCALE;
    var smallNoise  = NOISE_SCALE / SMALL_SCALE;

    var tiles = this.tiles = new Array( z );
    for( var k = 0; k < z; ++k ){
      var layer = tiles[ k ] = new Array( y );

      for( var j = 0; j < y; ++j ){
        var row = layer[ j ] = new Array( x );

        for( var i = 0; i < x; ++i ){
          var l = large .generate( i / bigNoise,    j / bigNoise,     k / Z_SCALE ) / BIG_SCALE;
          var m = medium.generate( i / mediumNoise, j / mediumNoise,  k / Z_SCALE ) / MEDIUM_SCALE;
          var s = small .generate( i / smallNoise,  j / smallNoise,   k / Z_SCALE ) / SMALL_SCALE;
          var value = (l + m + s) * DENSITY_SCALE * (k * k / z);

          if( value > SOLID_POINT ){
            row[ i ] = new Tile( parseInt( Math.random() * TILE_TYPE_COUNT, 10 ) );
          }
        }
      }
    }
  };

  // -------------------------------------------------------------------------------------------- //

  WorldPrototype.update = function( time ){
    _updateAll( this.controllers, time );
    _updateAll( this.objects,     time );
  };

  // -------------------------------------------------------------------------------------------- //

  WorldPrototype.getLayer = function( z ){
    return this.tiles[ z ];
  };

  // -------------------------------------------------------------------------------------------- //

  WorldPrototype.getTile = function( x, y, z ){
    if( x < 0 || y < 0 || y >= this.height || z < 0 || z >= this.depth ){
      return undefined;
    }
    return this.tiles[ z ][ y ][ x ];
  };

  // -------------------------------------------------------------------------------------------- //

  WorldPrototype.addObject = function( obj ){
    this.objects[ obj.id ] = obj;
    obj.world = this;
  };

  // -------------------------------------------------------------------------------------------- //

  WorldPrototype.addController = function( controller ){
    this.controllers[ controller.id ] = controller;
    controller.world = this;
  };

  // -------------------------------------------------------------------------------------------- //

  function _updateAll( items, time ){
    for( var id in items ){
      if( !items.hasOwnProperty( id ) ){
        continue;
      }

      items[ id ].update( time );
    }
  }

  // -------------------------------------------------------------------------------------------- //

  return World;
});
