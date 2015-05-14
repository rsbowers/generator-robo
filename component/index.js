'use strict';
var join = require('path').join;
var yeoman = require('yeoman-generator');
var roboUtils = require('../util.js');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.NamedBase.apply(this, arguments);
  },

  askFor: function () {
    var done = this.async();
    var name = this.name;

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
  },

  createStylesheet: function () {
    this.template('component.scss', 'app/styles/components/_'+this.componentname+'.scss');
    //var hook   = '//*=======yeoman component hook',
    //  path   = 'app/styles/main.scss',
    //  file   = this.readFileAsString(path),
    //  insert = "/*!==:cms:module:"+this.componentname+":==!*/"+"\n"+"@import 'components/"+this.componentname+"';";
    //
    //if (file.indexOf(insert) === -1) {
    //  this.write(path, file.replace(hook, insert+'\n\n'+hook), {force:true});
    //}
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
      //var hook   = '<!-- build:js({app,.tmp}) scripts/components.js -->',
      //  path   = 'app/templates/partials/global/html_tail.hbs',
      //  file   = this.readFileAsString(path),
      //  insert = '<script src="scripts/'+this.componentname+'.js"></script>';
      //
      //if (file.indexOf(insert) === -1) {
      //  this.write(path, file.replace(hook, hook+'\n'+insert), {force:true});
      //}
      roboUtils.rewriteFile({
        file: 'app/templates/partials/global/build-components.hbs',
        needle: '<!-- endbuild -->',
        splicable: [
          '<script src="scripts/'+this.componentname+'.js"></script>'
        ]
      });
    }
  }
});
