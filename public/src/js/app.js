(function(window, $, undefined){
  require('cssuseragent');

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  // Elements
  var $body =    $(document.body);
  var $container = $('.portfolio-content');
  var $shield    = $('.site-shield');
  var $gif       = $('.gif');
  var $follow    = $('.follow');

  // Components
  var PortfolioItem    = require('./components/portfolioItem.js');
  var PortfolioManager = require('./components/portfolioManager.js');
  var GifChanger       = require('./components/gifChanger.js');
  var breakpoints      = require('./components/bps.js');

  // Typing stuff
  var now = new Date();
  var nowString = [now.toDateString(), now.toTimeString()].join(' ');
  var typeString = '';
  var typeInterval = null;
  
  var typeLetter = function(finishCallback) {
    if (typeString.length >= nowString.length) {
      $follow.text(typeString)
      finishCallback && finishCallback()
      clearInterval(typeInterval)
    }
    else {
      var numToType = Math.random() < 0.5 ? 2 : (Math.random() < 0.5 ? 1 : 3)
      typeString = nowString.substring(0, typeString.length + numToType) // go two at a time
      var split = typeString.split('')
      shuffleArray(split)
      $follow.text(split.join(''))
    }
  }

  $(function(){
    var gifChanger = new GifChanger($gif);
    var portfolioManager = new PortfolioManager( $container, $shield );

    $container.find('a').each(function(index, el) {
      portfolioManager.registerItem(new PortfolioItem($(el)));
    });

    var showCallback = function() {
      $body.addClass('is-revealed');
      setTimeout(function() { $gif.addClass('show'); }, 1000);
    }

    setTimeout(function() {
      $body.addClass('is-loaded');

      if (window.innerWidth <= breakpoints.md) {
        $follow.text(nowString)
        showCallback()
      }
      else {
        setTimeout(function() {
          typeInterval = setInterval(function() {
            typeLetter(showCallback)
          }, 40)
        }, 800)
      }
    }, 800)
  });

})(window, jQuery);
