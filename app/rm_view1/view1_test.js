'use strict';

describe('myApp.rm_view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('rm_view1 controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var view1Ctrl = $controller('View1Ctrl');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});