'use strict';

module.exports = function(grunt) {
  var fs = require('fs-extra')

  grunt.registerMultiTask('cms', 'Export to CMS', function() {
    var cmsTasker = (function (cms, options) {

      return cms = {

        //task init
        init: function () {
          //register tasks
          grunt
            .registerTask('cms:relocate-dist', cms.relocateDist)
            .registerTask('cms:clean', cms.clean)
            .registerTask('cms:build-globals', cms.build.globals)
            .registerTask('cms:build-modules', cms.build.modules)
            .registerTask('cms:onComplete', cms.onComplete)

          //run tasks
          grunt
            .task.run([
              'cms:relocate-dist',
              'cms:clean',
              'cms:build-globals',
              'cms:build-modules',
              'cms:onComplete'
            ])
        },

        //grunt log
        log: function(data) {
          if (typeof data === 'object' || typeof data === 'array'){
            grunt.log.write(JSON.stringify(data)+'\r\n')
          } else {
            grunt.log.write(data+'\r\n')
          }

          return this;
        },

        //recursive foreach
        foreachPath: function(opts) {
          var path = opts.path,
            validPath = fs.existsSync(path),
            msg = opts.msg

          if(validPath){
            fs.readdirSync(path).forEach(function(file,index){
              var curPath = path + "/" + file,
                isDir = fs.lstatSync(curPath).isDirectory(),
                isFile = fs.lstatSync(curPath).isFile()

              if(isDir && opts.dirs)
                opts.dirs(curPath, file, index)

              if(isFile && opts.files)
                opts.files(curPath, file, index)
            })

            if(opts.complete) opts.complete(validPath)
          }

          cms.log(validPath ? msg + path : path + ' does not exist')
        },

        //move the site build from dist root to a site folder
        relocateDist: function () {
          //move compiled site build to new folder
          if (options.dist) {
            var siteBuild = options.dist+'/site';

            fs.ensureDirSync(siteBuild)
            cms.clean(siteBuild)

            cms.foreachPath({
              path: options.dist,
              msg: 'Relocated: ',
              dirs: function (path, dir, index) {
                if(dir != 'cms'){
                  fs.copySync(path, siteBuild+'/'+dir)
                  cms.clean(path)
                }
              },

              files: function (path, file, index) {
                fs.copySync(path, siteBuild+'/'+file)
                fs.remove(path)
              },

              complete: function (validPath) {

              }
            })
          }
        },

        //clean
        clean: function (path) {
          if(!path) path = options.dest;

          cms.foreachPath({
            path: path,
            msg: 'Cleaned: ',

            dirs: function (path, dir, index) {
              cms.clean(path)
            },

            files: function (path, file, index) {
              fs.unlinkSync(path)
            },

            complete: function (validPath) {
              if(validPath) fs.rmdirSync(path)
            }
          })
        },

        build: {
          globals: function () {
            fs.ensureDirSync('.tmp/cms')
            cms.clean('.tmp/cms')

            var images =  options.globals.images,
              fonts = options.globals.fonts,
              scss = options.globals.scss.styles,
              dest = options.dest+'/cms.global'

            fs.ensureDirSync(dest+'/css')
            fs.ensureDirSync(dest+'/js')
            fs.ensureDirSync(dest+'/images')
            fs.ensureDirSync(dest+'/fonts')

            fs.copySync(images, dest+'/images')
            fs.copySync(fonts, dest+'/fonts')

            /*----------------------
             Compile CSS */
            var compiledCss = fs.readFileSync(options.dist+'/site/styles/'+ options.mainCSS, 'utf8').split('/*!==:cms:');
            compiledCss.forEach(function(cms, index){
              var css = cms.split(':==!*/')[1],
                type = cms.split(':==!*/')[0].split(':')[0],
                name = cms.split(':==!*/')[0].split(':')[1]

              // Copy module specific CSS to each module's directory
              if(name && type == 'module')
                fs.outputFileSync(options.dist+'/cms/cms.'+name+'/css/'+name+'.css', css)

              // Copy global CSS to global directory
              if(name && type == 'global')
                fs.outputFileSync(options.dist+'/cms/cms.'+type+'/css/'+name+'.css', css)
            })
          },

          modules: function () {

            /*----------------------
             Compile Global Scripts: Vendor
             */
            var scriptsVendor = fs.readFileSync(options.globals.scripts.concat.vendor);
            fs.outputFileSync(options.dist+'/cms/cms.global/js/vendor.js', scriptsVendor);

            /*----------------------
             Compile Global Scripts: Main
             */
            var scriptsMain = fs.readFileSync(options.globals.scripts.concat.main);
            fs.outputFileSync(options.dist+'/cms/cms.global/js/' + options.mainJS, scriptsMain);

            /*----------------------
             Compile HTML: Modules */
            var modules = fs.readdirSync(options.components.dirs.markup);
            modules.forEach(function(module,index){
              var name = module.split('.hbs')[0],
                markup = fs.readFileSync(options.components.dirs.markup+module, 'utf8'),
                dest = options.dest+'/cms.'+name,
                fileOutput = name,
                filePreviewOutput = name+'-preview';

              if(name !== '.DS_Store') {

                // Gernate the hbs oage files fopr this component
                cms.compile.template(name, markup, dest, options.components.layout, fileOutput);
                cms.compile.template(name, markup, dest, options.components.preview, filePreviewOutput);
                console.log('~ Module Processed ~');
                console.log(dest);

                // If this module has a corresponding JS file, copy it into the directory
                if (fs.existsSync(options.components.dirs.scripts+'app.'+name+'.js')) {
                  fs.ensureDirSync(dest+'/js');
                  fs.copySync(options.components.dirs.scripts+'app.'+name+'.js', dest+'/js/app.'+name+'.js');
                  console.log('~ Module JS Copied into CMS Destination ~');
                  console.log(options.components.dirs.scripts+'app.'+name);
                }
              }
            })

            grunt.task.run([
              'assemble'
            ])
          }
        },

        //generic compiling
        compile: {
          template: function (name, markup, dest, layout, filename) {
            var cmsTemp = fs.readFileSync(layout, 'utf8').split('<!-- cms:'),
              cssFlag = new RegExp('css -->'),
              modernizrFlag =  new RegExp('modernizr -->'),
              moduleFlag = new RegExp('module -->'),
              scriptsFlag =  new RegExp('scripts -->'),
              moduleTemp = []

            var modernizr = '<script src="../cms.global/js/modernizr.js"></script>',
              css = [
                '<link href="../cms.global/css/'+ options.mainCSS +'" rel="stylesheet">',
                '<link href="./css/'+name+'.css" rel="stylesheet">',
                '<link href="../cms.global/css/fallbacks.css" rel="stylesheet">'
              ].join('\r\n')

            cmsTemp.forEach(function(cmsFile, index) {
              if(index === 0){
                var assembleData = ''

                if(typeof options.components.data[name] === 'object'){
                  assembleData = 'modules: ['
                  options.components.data[name].forEach(function(moduleData, index){
                    var lineEnd = index === (options.components.data[name].length - 1) ? ']' : ','
                    assembleData += '+moduleData+'+lineEnd
                  })
                } else if(options.components.data[name]){
                  assembleData = 'modules: [+options.components.data[name]+]'
                }

                var assemble = [
                  '---',
                  'layout: false',
                  'data_navigation: <%=navigation %>',
                  'modules_accordion: <%=accordion %>',
                  'modules_article_blog: <%=article_blog %>',
                  'modules_basic_content: <%=basic_content %>',
                  'modules_basic_content_media: <%=basic_content_media %>',
                  'modules_blog_summary: <%=blog_summary %>',
                  'modules_carousel: <%=carousel %>',
                  'modules_events: <%=events %>',
                  'modules_collection: <%=collection %>',
                  'modules_glossary: <%=glossary %>',
                  'modules_headline: <%=headline %>',
                  'modules_hero: <%=hero %>',
                  'modules_layout: <%=layout %>',
                  'modules_link_list: <%=link_list %>',
                  'modules_media_player: <%=media_player %>',
                  'modules_promo: <%=promo %>',
                  'modules_sitemap_accordion: <%=sitemap_accordion %>',
                  'modules_search_block: <%=search_block %>',
                  'modules_stand_alone_quote: <%=stand_alone_quote %>',
                  'modules_teaser: <%=teaser %>',
                  '---'
                ].join('\r\n');

                moduleTemp.push(assemble)
              }

              if(cmsFile.match(cssFlag))
                cmsFile = cmsFile.replace(cssFlag, css)

              if(cmsFile.match(modernizrFlag))
                cmsFile = cmsFile.replace(modernizrFlag, modernizr)

              if(cmsFile.match(moduleFlag)){
                if(typeof options.components.data[name] === 'object'){
                  var t = []
                  options.components.data[name].forEach(function(moduleData, index){
                    t.push('{{> '+name+' '+moduleData+'}}')
                  })
                  var st = t.join('\r\n')
                  cmsFile = cmsFile.replace(moduleFlag, st)
                } else if(options.components.data[name]){
                  cmsFile = cmsFile.replace(moduleFlag, '{{> '+name+' '+options.components.data[name]+'}}')
                } else {
                  cmsFile = cmsFile.replace(moduleFlag, '{{> '+name+'}}')
                }
              }

              if(cmsFile.match(scriptsFlag)){
                var moduleScripts = [
                  '<script src="../cms.global/js/libs.js"></script>'
                ]
                console.log('~~');
                console.log(options.components.dirs.scripts+'app.'+name+'.js');
                if (fs.existsSync(options.components.dirs.scripts+'app.'+name+'.js')) {
                  fs.copySync(options.components.dirs.scripts+'app.'+name+'.js', dest+'/js/app.'+name+'.js')
                  moduleScripts.push('<script src="./js/app.'+name+'.js"></script>')
                }

                moduleScripts.push('<script src="../cms.global/js/'+ options.mainJS +'"></script>')
                var scripts = moduleScripts.join('\r\n')

                cmsFile = cmsFile.replace(scriptsFlag, scripts)
              }

              moduleTemp.push(cmsFile)
            })

            var outputPath = options.templates+'/pages/cms-module.'+filename+'.hbs'
            fs.outputFileSync(outputPath, moduleTemp.join('\r\n'))
          }
        },

        onComplete: function () {
          var cmsFiles = new RegExp('cms-module.')

          fs.readdirSync(options.app).forEach(function (file, index){
            cms.log(  'Processing:' + file  );
            if(file.match(cmsFiles)){
              var name = file.split('cms-module.')[1].split('.html')[0];
              var directory = name;
              var preview = name.split('-prev');
              if (preview.length > 1) {
                directory = preview[0];
              };
              if(name != 'html'){
                fs.outputFileSync(options.dist+'/cms/cms.'+directory+'/'+name+'.html', fs.readFileSync(options.app+'/'+file))
                fs.unlinkSync(options.templates+'/pages/cms-module.'+name+'.hbs')
                fs.unlinkSync(options.app+'/'+file)
              }
            }
          })
        }
      }

    })(cmsTasker || {}, this.data).init()
  })
}
