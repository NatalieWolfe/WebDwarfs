/* global lib */

lib.register( 'Octree', [], function(){
  var Cell = (function(){
    function Cell( x, y, width, height ){
      this.nw = null;
      this.ne = null;
      this.se = null;
      this.sw = null;
      
    }
    
    return Cell;
  })

  // -------------------------------------------------------------------------------------------- //

  function Octree( width, height ){
    this.tree = new Cell( 0, 0, width, height );
  }
  var OctreePrototype = Octree.prototype;

  // -------------------------------------------------------------------------------------------- //



  // -------------------------------------------------------------------------------------------- //

  return Octree;
});
