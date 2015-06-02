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
    var name = changeCase.paramCase(this.name);

    var prompts = [
      {
        name: 'pagename',
        message: 'What will the url of your page be?',
        default: name
      }
    ];

    this.prompt(prompts, function (props) {
      this.pagename = props.pagename;
      done();
    }.bind(this));
  },

  createPage: function () {
    this.template('page.hbs', 'app/templates/pages/'+this.pagename+'.hbs');
  },

  createJson: function () {
    this.template('page.json', 'app/templates/data/page_'+this.pagename+'.json');
  }
});
