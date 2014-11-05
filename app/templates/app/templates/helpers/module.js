'use strict';

// Export helpers
module.exports.register = function (Handlebars, options) {
    Handlebars.registerHelper('module', function (options) {
        var module = options.hash.module_data ? options.hash.module_data : this;

        if(module.render != false){
            var moduleKey = options.hash.module_data ? Object.keys(module)[0] : module.keyname,
                moduleClass = module.class ?  ' '+module.class : '',
                moduleExtend = module.extend ?  ' module-'+module.extend : '',
                moduleData = '';

            if(module.data) moduleData = module.data.attr && module.data.value ? " data-"+module.data.attr+"="+module.data.value : '';
            return '<!--MODULE '+moduleKey+' --><section class="module-'+moduleKey+''+moduleExtend+''+moduleClass+'"'+moduleData+'>'+options.fn(module)+'</section><!-- /MODULE -->';
        }
    });
};
