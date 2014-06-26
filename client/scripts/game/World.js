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
lib.register( 'World', [], function(){
  var TILE_TYPES = {
    GRASS : 0,
    BUSH  : 1,
    TREE  : 2
  };
  var TILE_TYPE_NAMES = Object.keys( TILE_TYPES );
  var TILE_TYPE_COUNT = TILE_TYPE_NAMES.length;

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

    var tiles = this.tiles = new Array( z );
    for( var i = 0; i < z; ++i ){
      var layer = tiles[ i ] = new Array( y );
      for( var j = 0; j < y; ++j ){
        var row = layer[ j ] = new Array( x );
        for( var k = 0; k < x; ++k ){
          row[ k ] = new Tile( parseInt( Math.random() * TILE_TYPE_COUNT, 10 ) );
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
    if( x < 0 || y < 0 || z < 0 ){
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
