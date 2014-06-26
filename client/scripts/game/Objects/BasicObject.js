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
