// jshint devel:true


(function () {
  'use strict';

  //==================================================
  // "APP" NAMESPACE
  //--------------------------------------------------
  window.APP = (typeof APP !== 'undefined' && APP instanceof Object) ? APP : {

    //--------------------------------------------------
    // CONFIGS
    //--------------------------------------------------
    configs: {
      activeClass: 'app-active',
      views: { //from _site-settings.scss
        'large': 1200, // $width-large: 75em;  // 1200/16
        'medium': 992, // $width-medium: 62em; //  992/16
        'small': 752, // $width-small: 48em;  //  768/16
        'xsmall': 480
      },
      isMobile: {
        Android: function () {
          return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
          return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
          return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
          return (APP.configs.isMobile.Android() || APP.configs.isMobile.BlackBerry() || APP.configs.isMobile.iOS() || APP.configs.isMobile.Opera() || APP.configs.isMobile.Windows());
        }
      }
    },

    //--------------------------------------------------
    // UTILITY METHODS
    //--------------------------------------------------
    utils: {
      getIEVersion: function () {
        var agent = navigator.userAgent;
        var reg = /MSIE\s?(\d+)(?:\.(\d+))?/i;
        var matches = agent.match(reg);
        if (matches !== null) {
          return {
            major: matches[1],
            minor: matches[2]
          };
        }
        return {
          major: '-1',
          minor: '-1'
        };
      },
      getViewport: function () {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        var size;
        if ($('html').hasClass('lt-ie9')) {
          size = 'large';
        } else {
          size = (w <= APP.configs.views.xsmall) ? 'xsmall' : size;
          size = (w > APP.configs.views.xsmall) ? 'small' : size;
          size = (w > APP.configs.views.small) ? 'medium' : size;
          size = (w > APP.configs.views.medium) ? 'large' : size;
          size = (w > APP.configs.views.large) ? 'xlarge' : size;
        }

        APP.configs.viewport = {
          size: size,
          width: w,
          height: h
        };

        return APP.configs.viewport;
      }
    }
  };
  //--------------------------------------------------
  // end "APP" NAMESPACE
  //==================================================

  //==================================================
  // DOCUMENT READY...
  //--------------------------------------------------

  $(function () {

    APP.utils.getViewport();

    //--------------------------------------------------
    // Add IE10 Class
    //--------------------------------------------------
    if (APP.utils.getIEVersion().major === '10') {
      $('html').addClass('ie10');
    }
    //--------------------------------------------------

    //--------------------------------------------------
    // RESIZE EVENT
    // Fires "windowResize" on $(window)
    //--------------------------------------------------
    /*
    var resizeTimer;
    $(window).resize(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        APP.utils.getViewport();
        APP.utils.aspectRatio();
        $(window).trigger('windowResize');
      }, 500);
    });
    */
    //--------------------------------------------------

    //--------------------------------------------------
    //  INIT MODULES
    //  Initialize the app's modules
    //--------------------------------------------------
    APP.Nav.init();

    console.log("'Allo, Robo!");

  });

  //--------------------------------------------------
  // end DOCUMENT READY...
  //==================================================

}());
