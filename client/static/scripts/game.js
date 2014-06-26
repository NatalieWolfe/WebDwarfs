
var lib = (function( $ ){

  var lib     = {};
  var classes = {};
  var waiters = [];
  var ready   = false;

  // -------------------------------------------------------------------------------------------- //

  lib._classes = classes;

  // -------------------------------------------------------------------------------------------- //

  lib.require = function( reqs, cb ){
    waiters.push({
      reqs  : reqs,
      cb    : cb
    });
    _updateWaiters();
  };

  // -------------------------------------------------------------------------------------------- //

  lib.register = function( clasName, reqs, cb ){
    lib.require( reqs, function(){
      classes[ clasName ] = cb.apply( null, arguments );
      _updateWaiters();
    });
  };

  // -------------------------------------------------------------------------------------------- //

  /**
   * @brief Makes `Base` inherit from `Super`.
   *
   * {Object} inherits( {Function} Base, {Function} Super )
   *
   * @param {Function} Base  The base class to have inherit from `Super`.
   * @param {Function} Super The super class to inherit from.
   *
   * @return {Object} The base class' prototype.
   */
  lib.inherits = (
    $.isFunction( Object.create ) ?
    function( Base, Super ){
      var baseProto = Base.prototype = Object.create( Super.prototype );
      baseProto.constructor = Base;
      baseProto._super = function( method, args ){
        return Super.prototype[ method ].apply( this, args );
      };
      return baseProto;
    } :
    function( Base, Super ){
      var Tmp = $.noop;
      Tmp.prototype = Super.prototype;
      Tmp.prototype.constructor = Super;
      var baseProto = Base.prototype = new Tmp();
      baseProto.constructor = Base;
      baseProto._super = function( method, args ){
        return Super.prototype[ method ].apply( this, args );
      };
      return baseProto;
    }
  );

  // -------------------------------------------------------------------------------------------- //

  function _updateWaiters(){
    // Don't call anyone until the DOM is ready.
    if( !ready ){
      return;
    }

    // Pull out all the waiting functions whose requirements are ready.
    var reqsReady = [];
    var i;
    for( i = 0; i < waiters.length; ++i ){
      var waiter = waiters[ i ];
      if( _reqsAvailable( waiter.reqs ) ){
        reqsReady.push( waiter );
        waiters.splice( i, 1 );
        --i;
      }
    }

    // Call all the ready functions.
    for( i = 0; i < reqsReady.length; ++i ){
      var waiter = reqsReady[ i ];
      var reqs = waiter.reqs.map(function( name ){ return classes[ name ]; });
      waiter.cb.apply( null, reqs );
    }
  }

  // -------------------------------------------------------------------------------------------- //

  function _reqsAvailable( reqs ){
    for( var i = 0; i < reqs.length; ++i ){
      if( !classes[ reqs[ i ] ] ){
        return false;
      }
    }
    return true;
  }

  // -------------------------------------------------------------------------------------------- //

  $(function(){
    ready = true;
    _updateWaiters();
  })

  // -------------------------------------------------------------------------------------------- //

  return lib;
})( jQuery );
/* global lib */

lib.register( 'BasicController', [], function(){
  function BasicController(){
  }
  var BasicControllerPrototype = BasicController.prototype;

  // -------------------------------------------------------------------------------------------- //

  return BasicController;
});
/* global lib */

lib.register(
  'CameraController',
  [ 'BasicController', 'KeyState' ],
  function( BasicController, KeyState ){

    var PAN_SPEED = 0.02; // Tiles per millisecond.
  
    // ------------------------------------------------------------------------------------------ //

    function CameraController( camera ){
      BasicController.call( this );
      this.camera = camera;
    }
    lib.inherits( CameraController, BasicController );
    var CameraControllerPrototype = CameraController.prototype;
  
    // ------------------------------------------------------------------------------------------ //

    CameraControllerPrototype.update = function( time ){
      var KEYS      = KeyState.KEYS;
      var keyState  = KeyState.instance;
      var camera    = this.camera;

      // Vertical movement.
      if( keyState.isPressed( KEYS.W ) ){
        camera.setYVelocity( -PAN_SPEED );
      }
      else if( keyState.isPressed( KEYS.S ) ){
        camera.setYVelocity( PAN_SPEED );
      }
      else {
        camera.setYVelocity( 0 );
      }

      // Horizontal movement.
      if( keyState.isPressed( KEYS.A ) ){
        camera.setXVelocity( -PAN_SPEED );
      }
      else if( keyState.isPressed( KEYS.D ) ){
        camera.setXVelocity( PAN_SPEED );
      }
      else {
        camera.setXVelocity( 0 );
      }
    };

    // ------------------------------------------------------------------------------------------ //
  
    return CameraController;
  }
);
/* global lib, $, window */

lib.register( 'KeyState', [], function(){
  function KeyState(){
    this.keyStates = {};
  }
  var KeyStatePrototype = KeyState.prototype;

  // -------------------------------------------------------------------------------------------- //

  var KEYS = KeyState.KEYS = {
    A       : '_65',
    B       : '_66',
    C       : '_67',
    D       : '_68',
    E       : '_69',
    F       : '_70',
    G       : '_71',
    H       : '_72',
    I       : '_73',
    J       : '_74',
    K       : '_75',
    L       : '_76',
    M       : '_77',
    N       : '_78',
    O       : '_79',
    P       : '_80',
    Q       : '_81',
    R       : '_82',
    S       : '_83',
    T       : '_84',
    U       : '_85',
    V       : '_86',
    W       : '_87',
    X       : '_88',
    Y       : '_89',
    Z       : '_90',
    UP      : '_38',
    DOWN    : '_40',
    LEFT    : '_37',
    RIGHT   : '_38',
    ONE     : '_49',
    TWO     : '_50',
    THREE   : '_51',
    FOUR    : '_52',
    FIVE    : '_53',
    SIX     : '_54',
    SEVEN   : '_55',
    EIGHT   : '_56',
    NINE    : '_57',
    ZERO    : '_48',
    SHIFT   : '_16',
    ALT     : '_18',
    META    : '_91',
    CONTROL : '_17',
    TAB     : '_9',
    TILDA   : '_192',
    MINUS   : '_189',
    EQUALS  : '_187',
  };

  // -------------------------------------------------------------------------------------------- //

  KeyStatePrototype.isPressed = function( key ){
    return Boolean( this.keyStates[ key ] );
  };

  // -------------------------------------------------------------------------------------------- //

  $(function(){
    $( window ).keydown(function( e ){
      var keyStates = KeyState.instance.keyStates;
      keyStates[ '_' + e.keyCode  ] = true;
      keyStates[ KEYS.SHIFT       ] = e.shiftKey;
      keyStates[ KEYS.CONTROL     ] = e.ctrlKey;
      keyStates[ KEYS.META        ] = e.metaKey;
    });
    $( window ).keyup(function( e ){
      var keyStates = KeyState.instance.keyStates;
      keyStates[ '_' + e.keyCode  ] = false;
      keyStates[ KEYS.SHIFT       ] = e.shiftKey;
      keyStates[ KEYS.CONTROL     ] = e.ctrlKey;
      keyStates[ KEYS.META        ] = e.metaKey;
    });
  });

  // -------------------------------------------------------------------------------------------- //

  KeyState.instance = new KeyState();
  return KeyState;
});
/* global lib */

lib.register( 'BasicObject', [], function(){
  function BasicObject(){
    this.id = _makeId();
    this._x = this.x = 0;
    this._y = this.y = 0;
    this._z = this.z = 0;
    this.velocity = [ 0, 0, 0 ];
  }
  var BasicObjectPrototype = BasicObject.prototype;

  // -------------------------------------------------------------------------------------------- //

  BasicObjectPrototype.setVelocity = function( x, y, z ){
    this.velocity = [ x, y, z ];
  };

  // -------------------------------------------------------------------------------------------- //

  BasicObjectPrototype.setXVelocity = function( x ){
    this.velocity[ 0 ] = x;
  };

  // -------------------------------------------------------------------------------------------- //

  BasicObjectPrototype.setYVelocity = function( y ){
    this.velocity[ 1 ] = y;
  };
  // -------------------------------------------------------------------------------------------- //

  BasicObjectPrototype.setZVelocity = function( z ){
    this.velocity[ 2 ] = z;
  };

  // -------------------------------------------------------------------------------------------- //

  BasicObjectPrototype.update = function( time ){
    // Update our position based on our velocity and the time passed.
    this.x = Math.round( this._x += this.velocity[ 0 ] * time );
    this.y = Math.round( this._y += this.velocity[ 1 ] * time );
    this.z = Math.round( this._z += this.velocity[ 2 ] * time );
  };

  // -------------------------------------------------------------------------------------------- //

  function _makeId(){
    function _makeIdPiece(){
      var piece = String( parseInt( Math.random() * 1000000000, 10 ) );
      while( piece.length < 9 ){
        piece += '0';
      }
      return piece;
    }

    return _makeIdPiece() + _makeIdPiece();
  };

  // -------------------------------------------------------------------------------------------- //

  return BasicObject;
});
/* global lib */

lib.register( 'Camera', [ 'BasicObject' ], function( BasicObject ){
  function Camera(){
    BasicObject.apply( this, arguments );
  }
  lib.inherits( Camera, BasicObject );

  // -------------------------------------------------------------------------------------------- //

  return Camera;
});
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
/* global jQuery, lib */

(function( $, window ){
  var STEP_TIME = 1000 / 30;

  var world       = null;
  var viewport    = null;

  lib.require(
    [ 'World', 'Viewport', 'Camera', 'CameraController' ],
    function( World, Viewport, Camera, CameraController ){
      world     = new World();
      viewport  = new Viewport( $( '#viewer' ) );
  
      var camera      = new Camera();
      var cameraCtrl  = new CameraController( camera );
  
      //               X    Y   Z
      world.generate( 100, 100, 1 );
      viewport.setFoV( 50,  25    );
  
      viewport.setCamera( camera );
      world.addObject( camera );
      world.addController( cameraCtrl );

      _render();
    }
  );

  var previousRenderTime = Date.now();
  function _render(){
    world.update( STEP_TIME );
    viewport.render();
    setTimeout( _render, STEP_TIME );
  }
})( jQuery, window );
