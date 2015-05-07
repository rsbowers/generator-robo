 'use strict';

module.exports = function(grunt) {
    var fs = require('fs-extra')

    grunt.registerMultiTask('cms', 'Export to CMS', function() {
        var cmsTasker = (function (cms, options) {

            return cms = {
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
                                // var htaccess = options.dist+'.htaccess',
                                //     siteDirAsRoot = [
                                //         'RewriteEngine on',
                                //         'RewriteCond %{HTTP_HOST} ^(www\.)?(.*)$',
                                //
                                //         'RewriteCond %{REQUEST_URI} !^/site/',
                                //         'RewriteCond %{REQUEST_FILENAME} !-f',
                                //         'RewriteCond %{REQUEST_FILENAME} !-d',
                                //
                                //         'RewriteRule ^(.*)$ /site/$1',
                                //
                                //         'RewriteCond %{HTTP_HOST} ^(www\.)?(.*)$',
                                //         'RewriteRule ^(/)?$ site/index.html [L]'
                                //     ].join('\r\n');
                                //
                                // fs.outputFileSync(htaccess, siteDirAsRoot)
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

                        cms.compile.css();
                        cms.log('Created: '+ dest)
                    },

                    modules: function () {
                        cms.compile.scripts.concat()
                        cms.compile.scripts.modules()
                        var modules = fs.readdirSync(options.module.dirs.markup);

                        modules.forEach(function(module,index){
                            var name = module.split('.hbs')[0],
                                markup = fs.readFileSync(options.module.dirs.markup+module, 'utf8'),
                                dest = options.dest+'/cms.'+name

                            if(name !== '.DS_Store') {
                              fs.ensureDirSync(dest+'/js')

                              cms.compile.template(name, markup, dest)
                              // fs.outputFileSync(dest+'/template/'+name+'.hbs', markup)

                              cms.log('Created: '+ dest)
                            }
                        })

                        grunt.task.run([
                            'assemble',
                            'prettify'
                        ])
                    }
                },

                //generic compiling
                compile: {
                    template: function (name, markup, dest) {
                        var cmsTemp = fs.readFileSync(options.module.layout, 'utf8').split('<!-- cms:'),
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

                                if(typeof options.module.data[name] === 'object'){
                                    assembleData = 'modules: ['
                                    options.module.data[name].forEach(function(moduleData, index){
                                        var lineEnd = index === (options.module.data[name].length - 1) ? ']' : ','
                                        assembleData += '<%='+moduleData+'%>'+lineEnd
                                    })
                                } else if(options.module.data[name]){
                                    assembleData = 'modules: [<%='+options.module.data[name]+'%>]'
                                }

                                var assemble = [
                                        '---',
                                        'layout: false',
                                        assembleData,
                                        '---'
                                    ].join('\r\n')

                                moduleTemp.push(assemble)
                            }

                            if(cmsFile.match(cssFlag))
                                cmsFile = cmsFile.replace(cssFlag, css)

                            if(cmsFile.match(modernizrFlag))
                                cmsFile = cmsFile.replace(modernizrFlag, modernizr)

                            if(cmsFile.match(moduleFlag)){
                                if(options.module.data[name]){
                                  cmsFile = cmsFile.replace(moduleFlag, '{{include-modules}}')
                                } else {
                                  cmsFile = cmsFile.replace(moduleFlag, '{{> '+name+'}}')
                                }
                            }

                            if(cmsFile.match(scriptsFlag)){
                                var moduleScripts = [
                                    '<script src="../cms.global/js/libs.js"></script>'
                                ]

                                if (fs.existsSync(options.module.dirs.scripts+name+'.js')) {
                                    fs.copySync(options.module.dirs.scripts+name+'.js', dest+'/js/'+name+'.js')
                                    moduleScripts.push('<script src="./js/'+name+'.js"></script>')
                                }

                                moduleScripts.push('<script src="../cms.global/js/'+ options.mainJS +'"></script>')
                                var scripts = moduleScripts.join('\r\n')

                                cmsFile = cmsFile.replace(scriptsFlag, scripts)
                            }

                            moduleTemp.push(cmsFile)
                        })

                        var outputPath = options.templates+'/pages/cms-module.'+name+'.hbs'
                        fs.outputFileSync(outputPath, moduleTemp.join('\r\n'))
                    },

                    css: function () {
                        var compiledCss = fs.readFileSync(options.dist+'/site/assets/styles/'+ options.mainCSS, 'utf8').split('/*!==:cms:');

                        compiledCss.forEach(function(cms, index){
                            var css = cms.split(':==!*/')[1],
                                type = cms.split(':==!*/')[0].split(':')[0],
                                name = cms.split(':==!*/')[0].split(':')[1]

                            if(name && type == 'module')
                                fs.outputFileSync(options.dist+'/cms/cms.'+name+'/css/'+name+'.css', css)

                            if(name && type == 'global')
                                fs.outputFileSync(options.dist+'/cms/cms.'+type+'/css/'+name+'.css', css)
                        })
                    },
                    scripts: {
                        concat: function () {
                            cms.compile.scripts.libs()
                            cms.compile.scripts.main()
                        },

                        libs: function () {
                            var scripts = options.globals.scripts.concat.libs,
                                libs = []

                            scripts.forEach(function(script,index){
                                libs.push(fs.readFileSync(script, 'utf8'))
                            })

                            fs.outputFileSync(options.dist+'/cms/cms.global/js/libs.js', libs.join('\r\n'))
                        },

                        main: function () {
                            var scripts = options.globals.scripts.concat.main,
                                main = []

                            scripts.forEach(function(script,index){
                                main.push(fs.readFileSync(script, 'utf8'))
                            })

                            fs.outputFileSync(options.dist+'/cms/cms.global/js/' + options.mainJS, main.join('\r\n'))
                        },

                        modules: function () {
                            var modules = options.globals.scripts.modules;

                            modules.forEach(function(module,index){
                              if (fs.existsSync(options.module.dirs.scripts+module)) {
                                  fs.copySync(options.module.dirs.scripts+module, options.dist+'/cms/cms.global/js/'+module)
                              }
                            })
                        }
                    }
                },

                onComplete: function () {
                    var cmsFiles = new RegExp('cms-module.')

                    fs.readdirSync(options.src).forEach(function (file, index){
                        cms.log(  'Processing:' + file  );
                        if(file.match(cmsFiles)){
                            var name = file.split('cms-module.')[1].split('.html')[0]
                            if(name != 'html'){
                                fs.outputFileSync(options.dist+'/cms/cms.'+name+'/'+name+'.html', fs.readFileSync(options.src+'/'+file))
                                fs.unlinkSync(options.templates+'/pages/cms-module.'+name+'.hbs')
                                fs.unlinkSync(options.src+'/'+file)
                            }
                        }
                    })
                }
            }

        })(cmsTasker || {}, this.data).init()
    })
}
