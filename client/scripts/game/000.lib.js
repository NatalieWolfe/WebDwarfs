
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
