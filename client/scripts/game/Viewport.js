/* globals lib */

lib.register( 'Viewport', [ 'World' ], function( World ){
  function Viewport( $view ){
    this.$view = $view;
  }
  var ViewportPrototype = Viewport.prototype;

  // -------------------------------------------------------------------------------------------- //

  ViewportPrototype.setFoV = function( width, height ){
    this.width  = width;
    this.height = height;
  };

  // -------------------------------------------------------------------------------------------- //

  ViewportPrototype.setCamera = function( camera ){
    this.camera = camera;
  };

  // -------------------------------------------------------------------------------------------- //

  ViewportPrototype.render = function(){
    var camera      = this.camera;
    var world       = camera.world;
    var layer       = world.getLayer( camera.z );
    var camOffX     = camera.x;
    var camOffY     = camera.y;
    var z           = camera.z;
    var width       = this.width;
    var height      = this.height;
    var worldWidth  = world.width;
    var worldHeight = world.height;
    var cells       = '<div class="layer">';

    for( var i = 0; i < height; ++i ){
      var y = camOffY + i;
      cells += '<div class="row">';
      for( var k = 0; k < width; ++k ){
        var x = camOffX + k;
        var cell;
        if( y >= worldHeight || x >= worldWidth ){
          cell = _makeCell();
        }
        else {
          cell = _makeCell( world.getTile( x, y, z ) );
        }
        cells += cell;
      }
      cells += '</div>';
    }
    this.$view.html( cells + '</div>' );
  };

  // -------------------------------------------------------------------------------------------- //

  function _makeCell( tile ){
    var cell = '<div class="cell ';
    if( !tile ){
      cell += 'empty';
    }
    else {
      cell += World.TILE_TYPE_NAMES[ tile.type ].toLowerCase();
    }
    return cell + '"></div>';
  }

  // -------------------------------------------------------------------------------------------- //

  return Viewport;
});
