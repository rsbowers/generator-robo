'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // setup the test-framework property, Gruntfile template will need this
    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });
    this.testFramework = this.options['test-framework'];

    this.pkg = require('../package.json');
  },

  askFor: function () {
    var done = this.async();

    // welcome message
    if (!this.options['skip-welcome-message']) {
      this.log(require('yosay')());
    }

    var prompts = [{
      type: "list",
      name: "includeSass",
      message: "Sass or Less?",
      choices: [ "Sass", "Less"],
      filter: function( val ) {
        var filterMap = {
          'Sass': true,
          'Less': false
        };

        return filterMap[val];
      }
    },{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: true
      }]
    }];

    this.prompt(prompts, function (answers) {
      var features = answers.features;

      function hasFeature(feat) {
        return features && features.indexOf(feat) !== -1;
      }

      this.includeSass = answers.includeSass;
      this.includeBootstrap = hasFeature('includeBootstrap');

      this.config.set('includeSass', this.includeSass);

      done();
    }.bind(this));
  },

  gruntfile: function () {
    this.template('Gruntfile.js');
  },

  packageJSON: function () {
    this.template('_package.json', 'package.json');
  },

  componentsJSON: function () {
    this.template('_components.json', 'components.json');
  },

  git: function () {
    this.template('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
  },

  bower: function () {
    var bower = {
      name: this._.slugify(this.appname),
      private: true,
      dependencies: {},
      devDependencies: {}
    };

    if (this.includeBootstrap) {
      var bs = 'bootstrap' + (this.includeSass ? '-sass-official' : '');
      bower.dependencies[bs] = '~3.3.0';
    }

    bower.dependencies.jquery = '~1.11.1';

    bower.devDependencies.modernizr = '~2.8.2';

    this.copy('bowerrc', '.bowerrc');
    this.write('bower.json', JSON.stringify(bower, null, 2));
  },

  jshint: function () {
    this.copy('jshintrc', '.jshintrc');
  },

  editorConfig: function () {
    this.copy('editorconfig', '.editorconfig');
  },

  writeHead: function () {
    this.headFile = this.engine(
      this.readFileAsString(join(this.sourceRoot(), 'html-head.hbs')),
      this
    );
  },

  writeCmsPreview: function () {
    this.cmsPreviewFile = this.engine(
      this.readFileAsString(join(this.sourceRoot(), 'cms-preview.hbs')),
      this
    );
  },

  app: function () {
    this.directory('app');
    this.directory('tasks');
    this.mkdir('app/scripts');
    //this.mkdir('app/styles');
    this.write('app/templates/partials/global/html-head.hbs', this.headFile);
    this.write('app/templates/layouts/cms-preview.hbs', this.cmsPreviewFile);
    this.copy('main.js', 'app/scripts/main.js');
    //this.template('main.scss', 'app/styles/main.scss');
    this.template('readme.md', 'readme.md');
    if (this.includeSass) {
      this.directory('sass_styles', 'app/styles');
      this.template('main.scss', 'app/styles/main.scss');
    } else {
      this.directory('less_styles', 'app/styles');
      this.template('main.less', 'app/styles/main.less');
    }
  },

  install: function () {
    this.installDependencies({
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });

    this.on('end', function () {
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install']
        }
      });
    });
  }
});
