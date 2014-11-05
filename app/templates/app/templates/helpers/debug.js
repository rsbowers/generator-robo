

module.exports.register = function (Handlebars, options, params) {

    Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
      if (optionalValue) {
          console.log("Value");
          console.log("====================");
          console.log(optionalValue);
      }
  });
};