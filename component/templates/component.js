// jshint devel:true

(function($) {
  'use strict';

  APP.<%= componentname %> = (function(<%= componentname %>) {
    return <%= componentname %> = {
      $el: $('.<%= componentname %>'),

      init: function() {
        <%= componentname %>.settings = {};
        console.log('I am <%= componentname %>.');
      }

    };
  })(APP.<%= componentname %> || {}); //Fired from APP
})(jQuery);
