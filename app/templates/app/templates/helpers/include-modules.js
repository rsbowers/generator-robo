/**
 * Forked from:
 *    Handlebars Helper: {{include}}
 *    Copyright (c) 2013 Jon Schlinkert
 *    Licensed under the MIT License (MIT).
 */

'use strict';

// node_modules
var minimatch = require('minimatch');
var matter = require('gray-matter');
var file = require('fs-utils');
var _ = require('lodash');

module.exports.register = function (Handlebars, options, params) {
    Handlebars.registerHelper('include-modules', function() {
        var assemble = params.assemble,
            partials = assemble.partials,
            grunt = params.grunt,
            opts = options || {},
            sections = [],
            page;

        if(!Array.isArray(assemble.partials)) partials = [partials];

        this.modules.forEach(function (module, i){
            var moduleName = Object.keys(module)[0],
                moduleData = module[moduleName];

            moduleData.keyname = moduleName;

            // first try to match on the full name in the partials array
            var filepaths = _.filter(partials, function(filepath) {
                return file.basename(filepath) === moduleName;
            });

            // if no matches, then try minimatch
            if (!filepaths || filepaths.length <= 0) {
                filepaths = partials.filter(minimatch.filter(moduleName));
            }

            var results = filepaths.map(function(filepath) {
                var name = file.basename(filepath),
                    metadata = matter.read(filepath),
                    ctx = _.extend({}, this, opts.data[name], metadata, moduleData);

                ctx = grunt.config.process(ctx);

                var template = Handlebars.partials[name],
                    fn = Handlebars.compile(template),
                    output = fn(ctx).replace(/^\s+/, ''),
                    include = opts.include || opts.data.include || {};

                    if(include.origin === true) {
                        output = '<!-- ' + filepath + ' -->\n' + output;
                    }

                return output;

            }).join('\n');

            sections.push(results);
        });

        page = sections.join('');
        return new Handlebars.SafeString(page);
    });
};
