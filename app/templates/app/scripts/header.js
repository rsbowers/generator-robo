// jshint devel:true

(function($) {
  'use strict';

  APP.Nav = (function(Nav) {
    return Nav = {
      $el: $('.nav'),

      init: function() {
        Nav.settings = {};
        console.log('I am Nav.');
      }

    };
  })(APP.Nav || {}); //Fired from APP
})(jQuery);
