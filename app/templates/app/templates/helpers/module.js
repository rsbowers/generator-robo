'use strict';

// Export helpers
module.exports.register = function (Handlebars, options) {
  Handlebars.registerHelper('module', function (options) {

    var module = options.hash.module_data ? options.hash.module_data : this;

    if(module.render != false){
      var moduleKey = options.hash.module_data ? Object.keys(module)[0] : module.keyname,
        moduleClass = module.options ?  module.options.className : '',
        moduleLayout = module.options ?  module.options.layout : '',
        moduleData = '',
        modulePre = '',
        modulePost = '</div></div>';

      if(module.data) moduleData = module.data.attr && module.data.value ? " data-"+module.data.attr+"="+module.data.value : '';

      modulePre += '<div class="component ' + moduleLayout + '"><div class="' + moduleClass + '">';

      return modulePre + options.fn(module) + modulePost;
    }

  });
};
