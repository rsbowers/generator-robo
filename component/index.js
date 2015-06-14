'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var roboUtils = require('../util.js');
var fs = require('fs');
var changeCase = require('change-case');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.NamedBase.apply(this, arguments);
  },

  askFor: function () {
    var done = this.async();
    var name = changeCase.camelCase(this.name);

    var prompts = [
      {
        name: 'componentname',
        message: 'What will the name of your component be?',
        default: name
      },
      {
        type: 'confirm',
        name: 'jsfile',
        message: 'Will you be needing a js file for this component?'
      }
    ];

    this.prompt(prompts, function (props) {
      this.componentname = props.componentname;
      this.jsfile = props.jsfile;
      done();
    }.bind(this));
  },

  createComponent: function () {
    this.template('component.hbs', 'app/templates/partials/components/'+this.componentname+'.hbs');
    var componentDataConfig = JSON.parse(fs.readFileSync('components.json', 'utf8'));
    componentDataConfig[this.componentname] = "";
    fs.writeFileSync('components.json', JSON.stringify(componentDataConfig,null,2));
  },

  createStylesheet: function () {
    this.template('component.scss', 'app/styles/components/_'+this.componentname+'.scss');
    roboUtils.rewriteFile({
      file: 'app/styles/main.scss',
      needle: '//*=======yeoman component hook',
      splicable: [
        "/*!==:cms:module:"+this.componentname+":==!*/"+"\n"+"@import 'components/"+this.componentname+"';"
      ]
    });
  },

  createJavascript: function () {
    if (this.jsfile) {
      this.template('component.js', 'app/scripts/'+this.componentname+'.js');
      roboUtils.rewriteFile({
        file: 'app/templates/partials/global/build-components.hbs',
        needle: '<!-- endbuild -->',
        splicable: [
          '<script src="scripts/'+this.componentname+'.js"></script>'
        ]
      });
      roboUtils.rewriteFile({
        file: 'app/scripts/main.js',
        needle: '// end INIT MODULES',
        splicable: [
          'APP.'+this.componentname+'.init();'
        ]
      });
    }
  }
});