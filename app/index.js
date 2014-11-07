'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var RoboGenerator = yeoman.generators.Base.extend({
  initializing: function () {

    this.configs = '';

    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the funkadelic Robo generator!'
    ));

    var prompts = [{
      type: 'confirm',
      name: 'someOption',
      message: 'Would you like to enable this option?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.someOption = props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.directory('app');

      this.src.copy('_package.json', 'package.json');
      this.src.copy('_bower.json', 'bower.json');
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    },

    gruntfile: function () {
      this.src.copy('Gruntfile.js', 'Gruntfile.js');
    },

    tasks: function () {
      this.directory('tasks');
    },

    tmp: function () {
      this.mkdir('tmp');
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = RoboGenerator;
